import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { ExcelRow } from '@/lib/excelParser'

type SelectOption = {
	value: string
	label: string
}

interface IInitialState {
	selectedAction: SelectOption | null
	excelObj: ExcelRow[]
}

const initialState: IInitialState = {
	selectedAction: null,
	excelObj: []
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
		}
	}
})

export const { setFilters, setExcelData } = actionSlice.actions
export default actionSlice.reducer
