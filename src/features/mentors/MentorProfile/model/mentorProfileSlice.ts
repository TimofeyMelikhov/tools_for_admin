import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { ExcelRow } from '@/shared/lib/excel/types'

type MentorProfileState = {
	excelObj: ExcelRow[]
}

const initialState: MentorProfileState = {
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
