import { useCallback, useEffect, useMemo } from 'react'

import { enqueueSnackbar } from 'notistack'

import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux'
import { useDebounce } from '@/shared/hooks/useDebounce'
import type { ExcelRow } from '@/shared/lib/excel/types'

import {
	useGetGroupListQuery,
	useLazyGetCollaboratorsQuery,
	useLazyGetPersonsGroupQuery,
	useManageGroupMutation
} from '../api/groupManagementApi'

import { operationConfig } from './constants'
import {
	clearExcel,
	setAction,
	setCurrentGroup,
	setExcelData,
	setSearchString,
	setSelectedUser,
	setTargetGroup,
	setUsersToSelectList
} from './groupManagementSlice'
import type { ActionOption, CollaboratorOption, UploadListItem } from './types'

export const useGroupManagement = () => {
	const dispatch = useAppDispatch()
	const state = useAppSelector(s => s.groupManagement)

	const {
		selectedAction,
		currentGroup,
		targetGroup,
		selectedUsers,
		searchString,
		excelObj,
		selectedUser
	} = state

	const { data: groups = [] } = useGetGroupListQuery()

	const [fetchPersons, personsQuery] = useLazyGetPersonsGroupQuery()
	const [triggerSearch, collaboratorsQuery] = useLazyGetCollaboratorsQuery()
	const [manageGroup, manageQuery] = useManageGroupMutation()

	const debouncedSearch = useDebounce(searchString, 500).trim().toLowerCase()

	useEffect(() => {
		if (debouncedSearch.length >= 2) {
			triggerSearch({ search: debouncedSearch })
		} else {
			collaboratorsQuery.reset()
		}
	}, [debouncedSearch, triggerSearch])

	useEffect(() => {
		const needPersons =
			currentGroup &&
			selectedAction?.value !== 'addToGroup' &&
			!personsQuery.data

		if (!needPersons) return

		fetchPersons(currentGroup)
			.unwrap()
			.catch(() => {
				enqueueSnackbar('Ошибка при загрузке списка сотрудников', {
					variant: 'error',
					style: { fontSize: '14px' }
				})
			})
	}, [currentGroup, selectedAction?.value])

	const collaboratorsOptions: CollaboratorOption[] = useMemo(() => {
		return (collaboratorsQuery.data ?? []).map(employee => ({
			value: employee.id,
			label: `${employee.fullname} (${employee.position_name})`,
			employee
		}))
	}, [collaboratorsQuery.data])

	const filteredGroups = useMemo(
		() => groups.filter(g => g.id !== currentGroup?.id),
		[groups, currentGroup?.id]
	)

	const onExcelParsed = useCallback(
		(rows: ExcelRow[]) => dispatch(setExcelData(rows)),
		[dispatch]
	)

	const onActionChange = useCallback(
		(option: ActionOption | null) => {
			manageQuery.reset()
			collaboratorsQuery.reset()
			personsQuery.reset()

			dispatch(setAction(option))

			if (!option) {
				dispatch(setCurrentGroup(null))
				dispatch(setTargetGroup(null))
				dispatch(setUsersToSelectList([]))
				dispatch(setSelectedUser(null))
				dispatch(clearExcel())
			}
		},
		[dispatch]
	)

	const onCurrentGroupChange = useCallback(
		async (option: UploadListItem | null) => {
			manageQuery.reset()

			if (!option) {
				personsQuery.reset()
				dispatch(setCurrentGroup(null))
				dispatch(setUsersToSelectList([]))
				return
			}

			if (selectedAction?.value !== 'addToGroup') {
				try {
					await fetchPersons(option).unwrap()
				} catch {
					enqueueSnackbar('Ошибка при загрузке списка сотрудников', {
						variant: 'error',
						style: { fontSize: '14px' }
					})
				}
			}

			dispatch(setCurrentGroup(option))
		},
		[dispatch, selectedAction?.value, fetchPersons]
	)

	const onTargetGroupChange = useCallback(
		(option: UploadListItem | null) => {
			manageQuery.reset()
			dispatch(setTargetGroup(option))
		},
		[dispatch]
	)

	const onSearchChange = useCallback(
		(v: string) => dispatch(setSearchString(v)),
		[dispatch]
	)

	const onSelectedUserChange = useCallback(
		(option: CollaboratorOption | null) => {
			dispatch(setSelectedUser(option ? option.employee : null))
		},
		[dispatch]
	)

	const buttonText = useMemo(() => {
		switch (selectedAction?.value) {
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
	}, [selectedAction?.value])

	const submit = useCallback(async () => {
		if (!currentGroup) {
			enqueueSnackbar('Выберите группу', {
				variant: 'warning',
				style: { fontSize: '14px' }
			})
			return
		}

		if (selectedAction?.value === 'moveToGroup' && !targetGroup) {
			enqueueSnackbar('Выберите целевую группу для перемещения', {
				variant: 'warning',
				style: { fontSize: '14px' }
			})
			return
		}

		if (selectedAction?.value === 'moveToGroup' && !selectedUsers.length) {
			enqueueSnackbar('Выберите сотрудников для перемещения', {
				variant: 'warning',
				style: { fontSize: '14px' }
			})
			return
		}

		if (selectedAction?.value === 'installLeader' && !selectedUser) {
			enqueueSnackbar('Выберите руководителя группы', {
				variant: 'warning',
				style: { fontSize: '14px' }
			})
			return
		}

		if (!selectedAction) return

		const cfg = operationConfig[selectedAction.value]

		try {
			const res = await manageGroup({
				method: cfg.method,
				data: state,
				...(selectedAction.value === 'moveToGroup' && {
					targetGroupId: targetGroup?.id
				})
			}).unwrap()

			if (res.success) {
				// обновляем список участников группы для режимов, где он важен
				if (selectedAction.value !== 'addToGroup') {
					await fetchPersons(currentGroup).unwrap()
				}
				dispatch(setUsersToSelectList([]))

				enqueueSnackbar(res.message, {
					variant: 'success',
					style: { fontSize: '14px' }
				})
				return
			}

			if (res.code === 101) {
				enqueueSnackbar(res.message, {
					variant: 'warning',
					style: { fontSize: '14px' }
				})
			}
		} catch (e) {
			enqueueSnackbar('Произошла ошибка, попробуйте позже', {
				variant: 'error',
				style: { fontSize: '14px' }
			})
			console.error('Group operation error:', e)
		}
	}, [
		state,
		currentGroup,
		selectedAction,
		targetGroup,
		selectedUsers.length,
		selectedUser
	])

	const showPersonsList =
		selectedAction?.value === 'deleteFromGroup' ||
		selectedAction?.value === 'moveToGroup' ||
		selectedAction?.value === 'installLeader'

	const showExcelUploader =
		selectedAction?.value === 'addToGroup' &&
		!selectedUser &&
		excelObj.length === 0

	return {
		state,
		groups,
		filteredGroups,
		personsList: personsQuery.data,
		personsListLoading: personsQuery.isLoading,
		collaboratorsOptions,
		collaboratorsLoading: collaboratorsQuery.isLoading,
		manageData: manageQuery.data,
		isLoading: manageQuery.isLoading,
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
