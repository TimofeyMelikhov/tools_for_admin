import { apiRequest } from '@/shared/api/client'
import { ApiMethods, type ExcelOperationResponse } from '@/shared/api/types'
import type { ExcelObj } from '@/shared/lib/excel'

export const uploadQuestions = (body: ExcelObj) =>
	apiRequest<ExcelOperationResponse, ExcelObj>({
		apiMethod: ApiMethods.UPLOADING_QUESTIONS,
		body,
		httpMethod: 'post'
	})
