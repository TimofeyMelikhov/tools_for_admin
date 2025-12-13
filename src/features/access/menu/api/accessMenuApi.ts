import { createApi } from '@reduxjs/toolkit/query/react'

import { backendId } from '@/app/config'

import { baseQuery } from '@/shared/api/baseQuery'
import type { MenuResponse } from '@/shared/api/types'

export const accessMenuApi = createApi({
	reducerPath: 'accessMenuApi',
	baseQuery,
	tagTypes: ['AccessMenu'],
	endpoints: build => ({
		getAccessMenu: build.query<MenuResponse[], void>({
			query: () =>
				`custom_web_template.html?object_id=${backendId}&method=checkUserRole`,
			providesTags: ['AccessMenu']
		})
	})
})

export const { useGetAccessMenuQuery } = accessMenuApi
export const selectMenuItems = accessMenuApi.endpoints.getAccessMenu.select()
