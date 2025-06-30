import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { ExcelRow } from '@/lib/excelParser'
import type { ICoursesList, SelectOption } from '@/models/filtersModel'

interface IInitialState {
	selectedAction: SelectOption | null
	excelObj: ExcelRow[]
	coursesList: ICoursesList[]
}

const initialState: IInitialState = {
	selectedAction: null,
	excelObj: [],
	coursesList: []
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
		setCoursesList: (state, action: PayloadAction<ICoursesList[]>) => {
			state.coursesList = action.payload
		}
	}
})

export const { setFilters, setExcelData, setCoursesList } = actionSlice.actions
export default actionSlice.reducer
