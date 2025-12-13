import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { ExcelRow } from '@/shared/lib/excel/types'

import type { ActionOption, TrainingAssignState, UploadListItem } from './types'

const initialState: TrainingAssignState = {
	selectedAction: null,
	excelObj: [],
	currentObj: null,
	time: ''
}

const trainingAssignSlice = createSlice({
	name: 'trainingAssign',
	initialState,
	reducers: {
		setAction: (state, action: PayloadAction<ActionOption | null>) => {
			state.selectedAction = action.payload
			state.currentObj = null
		},
		setExcelData: (state, action: PayloadAction<ExcelRow[]>) => {
			state.excelObj = action.payload
		},
		setCurrentObj: (state, action: PayloadAction<UploadListItem | null>) => {
			state.currentObj = action.payload
		},
		setTimeAssign: (state, action: PayloadAction<string>) => {
			state.time = action.payload
		},
		cleanExcel: state => {
			state.excelObj = []
		},
		reset: () => initialState
	}
})

export const {
	setAction,
	setExcelData,
	setCurrentObj,
	setTimeAssign,
	cleanExcel,
	reset
} = trainingAssignSlice.actions

export default trainingAssignSlice.reducer
