import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type {
	IInitialStateGroup,
	IPersonFromServer,
	IUploadList,
	SelectOption
} from '@/models/filtersModel'

import type { ExcelRow } from '@/lib/excelParser'

const initialState: IInitialStateGroup = {
	selectedAction: null,
	excelObj: [],
	currentGroup: null,
	targetGroup: null,
	selectedUsers: [],
	searchString: '',
	collaborators: [],
	selectedUser: null
}

const groupManagementSlice = createSlice({
	name: 'groupManagementSlice',
	initialState,
	reducers: {
		setAction: (state, action: PayloadAction<SelectOption | null>) => {
			state.selectedAction = action.payload
		},
		setExcelData: (state, action: PayloadAction<ExcelRow[]>) => {
			state.excelObj = action.payload
		},
		setCurrentGroup: (state, action: PayloadAction<IUploadList | null>) => {
			state.currentGroup = action.payload
		},
		setTargetGroup: (state, action: PayloadAction<IUploadList | null>) => {
			state.targetGroup = action.payload
		},
		setSearchString: (state, action: PayloadAction<string>) => {
			state.searchString = action.payload
		},
		setCollaborators: (state, action: PayloadAction<IPersonFromServer[]>) => {
			state.collaborators = action.payload
		},
		setSelectedUser: (
			state,
			action: PayloadAction<IPersonFromServer | null>
		) => {
			state.selectedUser = action.payload
		},
		setUsersToSelectList: (
			state,
			action: PayloadAction<IPersonFromServer[]>
		) => {
			state.selectedUsers = action.payload
		}
	}
})

export const {
	setAction,
	setExcelData,
	setCurrentGroup,
	setTargetGroup,
	setSearchString,
	setSelectedUser,
	setUsersToSelectList
} = groupManagementSlice.actions
export default groupManagementSlice.reducer
