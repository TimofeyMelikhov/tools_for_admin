import { getApiErrorMessage } from '@/shared/api/types'
import { useExcelData } from '@/shared/lib/excel'

import { useUploadingQuestionsMutation } from './queries'
export const useUploadingQuestions = () => {
	const { excelData, excelLength, onExcelParsed, clearExcel } = useExcelData()
	const {
		mutateAsync: uploadingQuestions,
		data,
		isPending: isLoading,
		error
	} = useUploadingQuestionsMutation()
	const errorMessage = getApiErrorMessage(error)
	const submit = async (excelObj: typeof excelData) => {
		return uploadingQuestions({ excelObj })
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
