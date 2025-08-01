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
	usersToRemove: []
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
		setUsersToRemoveList: (
			state,
			action: PayloadAction<IPersonFromServer[]>
		) => {
			state.usersToRemove = action.payload
		},
		cleanExcelObj: state => {
			state.excelObj = []
		}
	}
})

export const {
	setAction,
	setExcelData,
	setCurrentGroup,
	cleanExcelObj,
	setUsersToRemoveList
} = groupManagementSlice.actions
export default groupManagementSlice.reducer
