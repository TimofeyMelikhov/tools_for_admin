import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { Person } from '@/entities/person'

import type { ExcelRow } from '@/shared/lib/excel'

import type {
	ActionOption,
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

const groupManagementSlice = createSlice({
	name: 'groupManagement',
	initialState,
	reducers: {
		setAction: (state, action: PayloadAction<ActionOption | null>) => {
			state.selectedAction = action.payload
			state.targetGroup = null
			state.selectedUser = null
			state.selectedUsers = []
			state.excelObj = []
		},
		setExcelData: (state, action: PayloadAction<ExcelRow[]>) => {
			state.excelObj = action.payload
		},
		clearExcel: state => {
			state.excelObj = []
		},
		setCurrentGroup: (state, action: PayloadAction<UploadListItem | null>) => {
			state.currentGroup = action.payload
			state.selectedUsers = []
			state.selectedUser = null
		},
		setTargetGroup: (state, action: PayloadAction<UploadListItem | null>) => {
			state.targetGroup = action.payload
		},
		setSelectedUser: (state, action: PayloadAction<Person | null>) => {
			state.selectedUser = action.payload
		},
		setUsersToSelectList: (state, action: PayloadAction<Person[]>) => {
			state.selectedUsers = action.payload
		},
		reset: () => initialState
	}
})

export const {
	setAction,
	setExcelData,
	clearExcel,
	setCurrentGroup,
	setTargetGroup,
	setSelectedUser,
	setUsersToSelectList,
	reset
} = groupManagementSlice.actions

export default groupManagementSlice.reducer
