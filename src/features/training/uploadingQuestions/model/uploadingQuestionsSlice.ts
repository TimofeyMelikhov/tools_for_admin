import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { ExcelRow } from '@/shared/lib/excel'

type uploadingQuestionsDataState = {
	excelObj: ExcelRow[]
}

const initialState: uploadingQuestionsDataState = {
	excelObj: []
}

const uploadingQuestions = createSlice({
	name: 'uploadingQuestionsData',
	initialState,
	reducers: {
		setExcelData: (state, action: PayloadAction<ExcelRow[]>) => {
			state.excelObj = action.payload
		},
		cleanExcelUploadingQuestionsData: state => {
			state.excelObj = []
		}
	}
})

export const { setExcelData, cleanExcelUploadingQuestionsData } =
	uploadingQuestions.actions
export default uploadingQuestions.reducer
