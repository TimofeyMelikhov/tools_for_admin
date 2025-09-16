import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import type { IAdaptationAssign, excelObj } from '@/models/filtersModel'

import { backendId, baseServerPath } from '@/config/global'

export const assignAdaptationApi = createApi({
	reducerPath: 'assignAdaptationApi',
	baseQuery: fetchBaseQuery({
		baseUrl: baseServerPath,
		prepareHeaders(headers) {
			headers.set('Content-Type', 'application/json')
			return headers
		}
	}),
	endpoints: build => ({
		assignAdaptation: build.mutation<IAdaptationAssign, excelObj>({
			query: ExcelRow => ({
				url: `custom_web_template.html?object_id=${backendId}&method=assignAdaptation`,
				method: 'POST',
				body: ExcelRow
			})
		})
	})
})

export const { useAssignAdaptationMutation } = assignAdaptationApi
