import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { ExcelRow } from '@/shared/lib/excel/types'

import type {
	ActionOption,
	GroupManagementState,
	Person,
	UploadListItem
} from './types'

const initialState: GroupManagementState = {
	selectedAction: null,
	excelObj: [],
	currentGroup: null,
	targetGroup: null,
	selectedUsers: [],
	searchString: '',
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
			state.searchString = ''
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
		setSearchString: (state, action: PayloadAction<string>) => {
			state.searchString = action.payload
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
	setSearchString,
	setSelectedUser,
	setUsersToSelectList,
	reset
} = groupManagementSlice.actions

export default groupManagementSlice.reducer
