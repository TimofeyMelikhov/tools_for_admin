import { createApi } from '@reduxjs/toolkit/query/react'

import { baseQuery } from '@/shared/api/baseQuery'
import {
	type ApiErrorResponse,
	ApiMethods,
	type ExcelOperationResponse,
	isApiErrorResponse
} from '@/shared/api/types'
import { BASE_URL_OBJECT_ID } from '@/shared/config'
import type { ExcelObj } from '@/shared/lib/excel'

export const uploadingQuestionsApi = createApi({
	reducerPath: 'uploadingQuestionsApi',
	baseQuery,
	endpoints: build => ({
		uploadingQuestions: build.mutation<ExcelOperationResponse, ExcelObj>({
			query: body => ({
				url: '',
				params: {
					object_id: BASE_URL_OBJECT_ID,
					method: ApiMethods.UPLOADING_QUESTIONS
				},
				method: 'POST',
				body
			}),
			transformErrorResponse: (response: { status: number; data: unknown }) => {
				if (isApiErrorResponse(response.data)) {
					return response.data
				}
				return {
					success: false,
					code: response.status,
					message: 'Unknown error'
				} as ApiErrorResponse
			}
		})
	})
})

export const { useUploadingQuestionsMutation } = uploadingQuestionsApi
