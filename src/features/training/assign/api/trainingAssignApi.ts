import { createApi } from '@reduxjs/toolkit/query/react'

import { backendId } from '@/app/config'

import { baseQuery } from '@/shared/api/baseQuery'
import type { ExcelOperationResponse } from '@/shared/api/types'

import type { TrainingAssignRequest, UploadListItem } from '../model/types'

export const trainingAssignApi = createApi({
	reducerPath: 'trainingAssignCourseApi',
	baseQuery,
	endpoints: build => ({
		getCurrentList: build.query<UploadListItem[], string>({
			query: method =>
				`custom_web_template.html?object_id=${backendId}&method=${method}`
		}),
		assignTraining: build.mutation<
			ExcelOperationResponse,
			TrainingAssignRequest
		>({
			query: body => ({
				url: `custom_web_template.html?object_id=${backendId}&method=dataReducer`,
				method: 'POST',
				body
			})
		})
	})
})

export const { useGetCurrentListQuery, useAssignTrainingMutation } =
	trainingAssignApi
