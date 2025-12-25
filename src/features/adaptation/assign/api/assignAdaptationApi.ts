import { createApi } from '@reduxjs/toolkit/query/react'

import { baseQuery } from '@/shared/api/baseQuery'
import { ApiMethods } from '@/shared/api/types'
import { BASE_URL_OBJECT_ID } from '@/shared/config'

import type {
	AssignAdaptationRequest,
	AssignAdaptationResponse
} from '../model/types'

export const assignAdaptationApi = createApi({
	reducerPath: 'assignAdaptationApi',
	baseQuery,
	endpoints: build => ({
		assignAdaptation: build.mutation<
			AssignAdaptationResponse,
			AssignAdaptationRequest
		>({
			query: body => ({
				url: '',
				params: {
					object_id: BASE_URL_OBJECT_ID,
					method: ApiMethods.ASSIGN_ADAPTATION
				},
				method: 'POST',
				body
			})
		})
	})
})

export const { useAssignAdaptationMutation } = assignAdaptationApi
