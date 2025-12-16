import { useCallback, useEffect, useMemo, useState } from 'react'

import { skipToken } from '@reduxjs/toolkit/query'
import { enqueueSnackbar } from 'notistack'
import type { InputActionMeta } from 'react-select'

import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux'
import { useDebounce } from '@/shared/hooks/useDebounce'
import type { ExcelRow } from '@/shared/lib/excel'

import {
	useGetCollaboratorsQuery,
	useGetGroupListQuery,
	useGetPersonsGroupQuery,
	useManageGroupMutation
} from '../api/groupManagementApi'

import { operationConfig, optionsForAction } from './constants'
import {
	clearExcel,
	reset,
	setAction,
	setCurrentGroup,
	setExcelData,
	setSelectedUser,
	setTargetGroup,
	setUsersToSelectList
} from './groupManagementSlice'
import type {
	ActionOption,
	CollaboratorOption,
	GroupAction,
	UploadListItem
} from './types'

const optionByValue = (value: GroupAction): ActionOption =>
	optionsForAction.find(o => o.value === value) ?? { value, label: value }

export const useGroupManagement = (forcedAction?: GroupAction) => {
	const dispatch = useAppDispatch()
	const state = useAppSelector(s => s.groupManagement)

	const {
		selectedAction,
		currentGroup,
		targetGroup,
		selectedUsers,
		excelObj,
		selectedUser
	} = state

	const [searchInput, setSearchInput] = useState('')

	const actionValue: GroupAction | undefined =
		forcedAction ?? selectedAction?.value

	useEffect(() => {
		if (!forcedAction) return
		dispatch(reset())
		setSearchInput('')
		dispatch(setAction(optionByValue(forcedAction)))
	}, [dispatch, forcedAction])

	// groups
	const { data: groups = [], isLoading: groupsLoading } = useGetGroupListQuery()

	const filteredGroups = useMemo(() => {
		const curId = currentGroup ? currentGroup.id : null
		return groups.filter(g => g.id !== curId)
	}, [groups, currentGroup])

	// persons in group
	const showPersonsList =
		actionValue === 'deleteFromGroup' ||
		actionValue === 'moveToGroup' ||
		actionValue === 'installLeader'

	const needPersons = !!currentGroup && showPersonsList

	const personsQueryArg = needPersons ? currentGroup : skipToken
	const personsQuery = useGetPersonsGroupQuery(personsQueryArg)
	const personsList = needPersons ? personsQuery.data : undefined
	const personsListLoading = needPersons ? personsQuery.isFetching : false

	// collaborators search
	const debouncedSearch = useDebounce(searchInput, 500).trim().toLowerCase()
	const canSearch =
		actionValue === 'addToGroup' || actionValue === 'installLeader'
	const shouldSearch = canSearch && debouncedSearch.length >= 2

	const collaboratorsQueryArg = shouldSearch
		? { search: debouncedSearch }
		: skipToken
	const collaboratorsQuery = useGetCollaboratorsQuery(collaboratorsQueryArg)

	const collaboratorsLoading = shouldSearch
		? collaboratorsQuery.isFetching
		: false

	const collaboratorsOptions: CollaboratorOption[] = useMemo(() => {
		if (!shouldSearch) return []

		return (collaboratorsQuery.data ?? []).map(employee => ({
			value: employee.id,
			label: `${employee.fullname} (${employee.position_name})`,
			employee
		}))
	}, [shouldSearch, collaboratorsQuery.data])

	// manage mutation
	const [manageGroup, manageState] = useManageGroupMutation()
	const { data: manageData, isLoading, reset: resetManage } = manageState

	// handlers
	const onExcelParsed = useCallback(
		(rows: ExcelRow[]) => dispatch(setExcelData(rows)),
		[dispatch]
	)

	const onActionChange = useCallback(
		(option: ActionOption | null) => {
			if (forcedAction) return

			resetManage()
			setSearchInput('')
			dispatch(setAction(option))

			if (!option) {
				dispatch(setCurrentGroup(null))
				dispatch(setTargetGroup(null))
				dispatch(setUsersToSelectList([]))
				dispatch(setSelectedUser(null))
				dispatch(clearExcel())
			}
		},
		[dispatch, forcedAction, resetManage]
	)

	const onCurrentGroupChange = useCallback(
		(option: UploadListItem | null) => {
			resetManage()
			dispatch(setCurrentGroup(option))
			dispatch(setUsersToSelectList([]))
		},
		[dispatch, resetManage]
	)

	const onTargetGroupChange = useCallback(
		(option: UploadListItem | null) => {
			resetManage()
			dispatch(setTargetGroup(option))
		},
		[dispatch, resetManage]
	)

	const onSearchChange = useCallback((value: string, meta: InputActionMeta) => {
		if (meta.action !== 'input-change') return value
		setSearchInput(value)
		return value
	}, [])

	const onSelectedUserChange = useCallback(
		(option: CollaboratorOption | null) => {
			dispatch(setSelectedUser(option ? option.employee : null))
		},
		[dispatch]
	)

	const buttonText = useMemo(() => {
		switch (actionValue) {
			case 'addToGroup':
				return 'Добавить сотрудников'
			case 'deleteFromGroup':
				return 'Удалить сотрудников'
			case 'moveToGroup':
				return 'Переместить сотрудников'
			case 'installLeader':
				return 'Установить руководителя'
			default:
				return 'Выполнить операцию'
		}
	}, [actionValue])

	const showExcelUploader =
		actionValue === 'addToGroup' && !selectedUser && excelObj.length === 0

	const submit = useCallback(async () => {
		if (!currentGroup) {
			enqueueSnackbar('Выберите группу', {
				variant: 'warning',
				style: { fontSize: '14px' }
			})
			return
		}

		if (!actionValue) return

		if (actionValue === 'moveToGroup' && !targetGroup) {
			enqueueSnackbar('Выберите целевую группу для перемещения', {
				variant: 'warning',
				style: { fontSize: '14px' }
			})
			return
		}

		if (
			(actionValue === 'moveToGroup' || actionValue === 'deleteFromGroup') &&
			!selectedUsers.length
		) {
			// FIX: добавил проверку для deleteFromGroup (чтобы не отправлять пустую операцию)
			enqueueSnackbar('Выберите сотрудников', {
				variant: 'warning',
				style: { fontSize: '14px' }
			})
			return
		}

		if (actionValue === 'installLeader' && !selectedUser) {
			enqueueSnackbar('Выберите руководителя группы', {
				variant: 'warning',
				style: { fontSize: '14px' }
			})
			return
		}

		resetManage()

		const cfg = operationConfig[actionValue]

		try {
			const res = await manageGroup({
				method: cfg.method,
				data: state,
				...(actionValue === 'moveToGroup' && {
					targetGroupId: targetGroup?.id
				})
			}).unwrap()

			if (!res.success) {
				if (res.code === 101) {
					enqueueSnackbar(res.message, {
						variant: 'warning',
						style: { fontSize: '14px' }
					})
				}
				return
			}

			dispatch(setUsersToSelectList([]))

			if (actionValue === 'addToGroup') {
				dispatch(clearExcel())
				dispatch(setSelectedUser(null))
				setSearchInput('')
			}

			if (actionValue === 'moveToGroup') {
				dispatch(setTargetGroup(null))
			}

			if (actionValue === 'installLeader') {
				dispatch(setSelectedUser(null))
				setSearchInput('')
			}

			enqueueSnackbar(res.message, {
				variant: 'success',
				style: { fontSize: '14px' }
			})
		} catch (e) {
			enqueueSnackbar('Произошла ошибка, попробуйте позже', {
				variant: 'error',
				style: { fontSize: '14px' }
			})
			console.error('Group operation error:', e)
		}
	}, [
		actionValue,
		currentGroup,
		targetGroup,
		selectedUsers.length,
		selectedUser,
		state,
		manageGroup,
		dispatch,
		resetManage
	])

	return {
		state,
		groups,
		filteredGroups,
		personsList,
		personsListLoading,
		groupsLoading,

		collaboratorsOptions,
		collaboratorsLoading,

		manageData,
		isLoading,

		onExcelParsed,
		onActionChange,
		onCurrentGroupChange,
		onTargetGroupChange,
		onSearchChange,
		onSelectedUserChange,

		buttonText,
		submit,
		showPersonsList,
		showExcelUploader
	}
}
