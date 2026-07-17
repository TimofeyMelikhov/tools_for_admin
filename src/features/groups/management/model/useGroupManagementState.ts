import { useCallback, useEffect, useState } from 'react'

import type { InputActionMeta } from 'react-select'

import type { ExcelRow } from '@/shared/lib/excel'

import { optionsForAction } from './constants'
import type {
	ActionOption,
	CollaboratorOption,
	GroupAction,
	GroupManagementState,
	UploadListItem
} from './types'

const initialState: GroupManagementState = {
	selectedAction: null,
	excelObj: [],
	currentGroup: null,
	targetGroup: null,
	selectedUsers: [],
	selectedUser: null
}

const optionByValue = (value: GroupAction): ActionOption =>
	optionsForAction.find(option => option.value === value) ?? {
		value,
		label: value
	}

export const useGroupManagementState = (forcedAction?: GroupAction) => {
	const [state, setState] = useState<GroupManagementState>(initialState)
	const [searchInput, setSearchInput] = useState('')

	useEffect(() => {
		if (!forcedAction) return
		setSearchInput('')
		setState({ ...initialState, selectedAction: optionByValue(forcedAction) })
	}, [forcedAction])

	const actionValue = forcedAction ?? state.selectedAction?.value

	const onExcelParsed = useCallback((rows: ExcelRow[]) => {
		setState(previous => ({ ...previous, excelObj: rows }))
	}, [])

	const onCurrentGroupChange = useCallback((option: UploadListItem | null) => {
		setState(previous => ({
			...previous,
			currentGroup: option,
			selectedUsers: [],
			selectedUser: null
		}))
	}, [])

	const onTargetGroupChange = useCallback((option: UploadListItem | null) => {
		setState(previous => ({ ...previous, targetGroup: option }))
	}, [])

	const onSearchChange = useCallback((value: string, meta: InputActionMeta) => {
		if (meta.action === 'input-change') setSearchInput(value)
		return value
	}, [])

	const onSelectedUserChange = useCallback(
		(option: CollaboratorOption | null) => {
			setState(previous => ({
				...previous,
				selectedUser: option?.employee ?? null
			}))
		},
		[]
	)

	const onSelectedUsersChange = useCallback(
		(selectedUsers: GroupManagementState['selectedUsers']) => {
			setState(previous => ({ ...previous, selectedUsers }))
		},
		[]
	)

	const clearExcel = useCallback(() => {
		setState(previous => ({ ...previous, excelObj: [] }))
	}, [])

	return {
		state,
		setState,
		actionValue,
		searchInput,
		setSearchInput,
		onExcelParsed,
		onCurrentGroupChange,
		onTargetGroupChange,
		onSearchChange,
		onSelectedUserChange,
		onSelectedUsersChange,
		clearExcel
	}
}
