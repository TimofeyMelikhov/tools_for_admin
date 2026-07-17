import { useCallback, useMemo } from 'react'
import type { Dispatch, SetStateAction } from 'react'

import { enqueueSnackbar } from 'notistack'

import { operationConfig } from './constants'
import { getGroupOperationValidationError } from './groupOperationValidation'
import { useManageGroup } from './queries'
import type { GroupAction, GroupManagementState } from './types'

type Params = {
	actionValue?: GroupAction
	state: GroupManagementState
	setState: Dispatch<SetStateAction<GroupManagementState>>
	setSearchInput: Dispatch<SetStateAction<string>>
}

export const useGroupManagementSubmit = ({
	actionValue,
	state,
	setState,
	setSearchInput
}: Params) => {
	const {
		mutateAsync: manageGroup,
		data: manageData,
		isPending: isLoading,
		reset: resetManage
	} = useManageGroup()

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

	const submit = useCallback(async () => {
		const validationError = getGroupOperationValidationError(actionValue, state)
		if (validationError) {
			enqueueSnackbar(validationError, {
				variant: 'warning',
				style: { fontSize: '14px' }
			})
			return
		}

		if (!actionValue) return
		const { targetGroup } = state

		resetManage()

		try {
			const result = await manageGroup({
				method: operationConfig[actionValue].method,
				data: state,
				...(actionValue === 'moveToGroup' && {
					targetGroupId: targetGroup?.id
				})
			})

			if (!result.success) {
				if (result.code === 101) {
					enqueueSnackbar(result.message, {
						variant: 'warning',
						style: { fontSize: '14px' }
					})
				}
				return
			}

			setState(previous => ({ ...previous, selectedUsers: [] }))

			if (actionValue === 'addToGroup') {
				setState(previous => ({
					...previous,
					excelObj: [],
					selectedUser: null
				}))
				setSearchInput('')
			}

			if (actionValue === 'moveToGroup') {
				setState(previous => ({ ...previous, targetGroup: null }))
			}

			if (actionValue === 'installLeader') {
				setState(previous => ({ ...previous, selectedUser: null }))
				setSearchInput('')
			}

			enqueueSnackbar(result.message, {
				variant: 'success',
				style: { fontSize: '14px' }
			})
		} catch (error) {
			enqueueSnackbar('Произошла ошибка, попробуйте позже', {
				variant: 'error',
				style: { fontSize: '14px' }
			})
			console.error('Group operation error:', error)
		}
	}, [actionValue, manageGroup, resetManage, setSearchInput, setState, state])

	return { buttonText, manageData, isLoading, resetManage, submit }
}
