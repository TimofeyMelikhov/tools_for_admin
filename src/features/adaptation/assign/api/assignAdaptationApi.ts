import { createApi } from '@reduxjs/toolkit/query/react'

import { backendId } from '@/app/config'

import { baseQuery } from '@/shared/api/baseQuery'

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
				url: `custom_web_template.html?object_id=${backendId}&method=assignAdaptation`,
				method: 'POST',
				body
			})
		})
	})
})

export const { useAssignAdaptationMutation } = assignAdaptationApi
