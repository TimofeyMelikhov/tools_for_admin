import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { excelObj } from '@/models/filtersModel'

import type { ExcelRow } from '@/lib/excelParser'

const initialState: excelObj = {
	excelObj: []
}

const mentorProfileSlice = createSlice({
	name: 'mentorProfile',
	initialState,
	reducers: {
		setExcelData: (state, action: PayloadAction<ExcelRow[]>) => {
			state.excelObj = action.payload
		},
		cleanExcelMentorProfile: state => {
			state.excelObj = []
		}
	}
})

export const { setExcelData, cleanExcelMentorProfile } =
	mentorProfileSlice.actions
export default mentorProfileSlice.reducer
