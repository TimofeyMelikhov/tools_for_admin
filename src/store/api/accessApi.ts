import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import type { IMenuResponse } from '@/models/filtersModel'

import { backendId, baseServerPath } from '@/config/global'

export const accessApi = createApi({
	reducerPath: 'accessApi',
	baseQuery: fetchBaseQuery({ baseUrl: baseServerPath }),
	tagTypes: ['AccessMenu'],
	endpoints: build => ({
		getAccessMenu: build.query<IMenuResponse[], void>({
			query: () =>
				`custom_web_template.html?object_id=${backendId}&method=checkUserRole`,
			providesTags: ['AccessMenu']
		})
	})
})

export const { useGetAccessMenuQuery } = accessApi
export const selectMenuItems = accessApi.endpoints.getAccessMenu.select()
