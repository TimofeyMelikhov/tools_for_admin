import { isApiErrorResponse } from '@/shared/api/types'
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux'
import type { ExcelRow } from '@/shared/lib/excel'

import { useUploadingQuestionsMutation } from '../api/uploadingQuestionsApi'

import {
	cleanExcelUploadingQuestionsData,
	setExcelData
} from './uploadingQuestionsSlice'

export const useUploadingQuestions = () => {
	const dispatch = useAppDispatch()

	const [uploadingQuestions, { data, isLoading, error }] =
		useUploadingQuestionsMutation()

	const excelData = useAppSelector(
		state => state.uploadingQuestionsData.excelObj
	)

	let errorMessage = ''
	if (error && 'data' in error && isApiErrorResponse(error.data)) {
		errorMessage = error.data.message
	} else if (error && isApiErrorResponse(error)) {
		errorMessage = error.message
	}

	const excelLength = excelData.length

	const onExcelParsed = (rows: ExcelRow[]) => {
		dispatch(setExcelData(rows))
	}

	const clearExcel = () => {
		dispatch(cleanExcelUploadingQuestionsData())
	}

	const submit = async (excelObj: ExcelRow[]) => {
		return await uploadingQuestions({ excelObj }).unwrap()
	}

	return {
		excelData,
		excelLength,
		isLoading,
		data,
		errorMessage,
		onExcelParsed,
		clearExcel,
		submit
	}
}
