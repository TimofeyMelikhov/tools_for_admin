import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { ExcelRow } from '@/lib/excelParser'

interface initialState {
	excelObj: ExcelRow[]
	startDateAdapt: string | null
}

const initialState: initialState = {
	excelObj: [],
	startDateAdapt: null
}

const assignAdaptationSlice = createSlice({
	name: 'assignAdaptation',
	initialState,
	reducers: {
		setExcelData: (state, action: PayloadAction<ExcelRow[]>) => {
			state.excelObj = action.payload
		},
		setStartDate: (state, action: PayloadAction<string | null>) => {
			state.startDateAdapt = action.payload
		},
		cleanExcelObj: state => {
			state.excelObj = []
		}
	}
})

export const { setExcelData, cleanExcelObj, setStartDate } =
	assignAdaptationSlice.actions
export default assignAdaptationSlice.reducer
