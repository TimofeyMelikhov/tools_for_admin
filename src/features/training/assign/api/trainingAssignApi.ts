import { createApi } from '@reduxjs/toolkit/query/react'

import { baseQuery } from '@/shared/api/baseQuery'
import { ApiMethods, type ExcelOperationResponse } from '@/shared/api/types'
import { BASE_URL_OBJECT_ID } from '@/shared/config'

import type { TrainingAssignRequest, UploadListItem } from '../model/types'

export const trainingAssignApi = createApi({
	reducerPath: 'trainingAssignCourseApi',
	baseQuery,
	endpoints: build => ({
		getCurrentList: build.query<UploadListItem[], string>({
			query: method => ({
				url: '',
				params: {
					object_id: BASE_URL_OBJECT_ID,
					method
				}
			})
		}),
		assignTraining: build.mutation<
			ExcelOperationResponse,
			TrainingAssignRequest
		>({
			query: body => ({
				url: '',
				params: {
					object_id: BASE_URL_OBJECT_ID,
					method: ApiMethods.DATA_REDUCER
				},
				method: 'POST',
				body
			})
		})
	})
})

export const { useGetCurrentListQuery, useAssignTrainingMutation } =
	trainingAssignApi
