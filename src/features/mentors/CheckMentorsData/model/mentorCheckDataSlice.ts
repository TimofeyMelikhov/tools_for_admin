import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { ExcelRow } from '@/shared/lib/excel'

type MentorCheckDataState = {
	excelObj: ExcelRow[]
}

const initialState: MentorCheckDataState = {
	excelObj: []
}

const mentorCheckDataSlice = createSlice({
	name: 'mentorCheckData',
	initialState,
	reducers: {
		setExcelData: (state, action: PayloadAction<ExcelRow[]>) => {
			state.excelObj = action.payload
		},
		cleanExcelMentorCheckData: state => {
			state.excelObj = []
		}
	}
})

export const { setExcelData, cleanExcelMentorCheckData } =
	mentorCheckDataSlice.actions
export default mentorCheckDataSlice.reducer
