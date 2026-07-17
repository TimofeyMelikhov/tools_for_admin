import { useCallback } from 'react'

import type { GroupAction, UploadListItem } from './types'
import { useGroupManagementData } from './useGroupManagementData'
import { useGroupManagementState } from './useGroupManagementState'
import { useGroupManagementSubmit } from './useGroupManagementSubmit'

export const useGroupManagement = (forcedAction?: GroupAction) => {
	const {
		state,
		setState,
		actionValue,
		searchInput,
		setSearchInput,
		onExcelParsed,
		onCurrentGroupChange: changeCurrentGroup,
		onTargetGroupChange: changeTargetGroup,
		onSearchChange,
		onSelectedUserChange,
		onSelectedUsersChange,
		clearExcel
	} = useGroupManagementState(forcedAction)

	const data = useGroupManagementData({
		actionValue,
		searchInput,
		currentGroup: state.currentGroup,
		selectedUser: state.selectedUser,
		excelObj: state.excelObj
	})

	const operation = useGroupManagementSubmit({
		actionValue,
		state,
		setState,
		setSearchInput
	})
	const { resetManage } = operation

	const onCurrentGroupChange = useCallback(
		(option: UploadListItem | null) => {
			resetManage()
			changeCurrentGroup(option)
		},
		[changeCurrentGroup, resetManage]
	)

	const onTargetGroupChange = useCallback(
		(option: UploadListItem | null) => {
			resetManage()
			changeTargetGroup(option)
		},
		[changeTargetGroup, resetManage]
	)

	return {
		state,
		...data,
		manageData: operation.manageData,
		isLoading: operation.isLoading,
		buttonText: operation.buttonText,
		submit: operation.submit,
		onExcelParsed,
		onCurrentGroupChange,
		onTargetGroupChange,
		onSearchChange,
		onSelectedUserChange,
		onSelectedUsersChange,
		clearExcel
	}
}
