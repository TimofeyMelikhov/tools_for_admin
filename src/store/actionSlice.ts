import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { ExcelRow } from '@/lib/excelParser'
import type {
	IInitialState,
	IUploadList,
	SelectOption
} from '@/models/filtersModel'

const initialState: IInitialState = {
	selectedAction: null,
	excelObj: [],
	currentObj: null,
	time: ''
}

const actionSlice = createSlice({
	name: 'filters',
	initialState,
	reducers: {
		setFilters: (state, action: PayloadAction<SelectOption | null>) => {
			state.selectedAction = action.payload
		},
		setExcelData: (state, action: PayloadAction<ExcelRow[]>) => {
			state.excelObj = action.payload
		},
		setCurrentObj: (state, action: PayloadAction<IUploadList | null>) => {
			state.currentObj = action.payload
		},
		setTimeAssign: (state, action: PayloadAction<string>) => {
			state.time = action.payload
		}
	}
})

export const { setFilters, setExcelData, setCurrentObj, setTimeAssign } =
	actionSlice.actions
export default actionSlice.reducer
