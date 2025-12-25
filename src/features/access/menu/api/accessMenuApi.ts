import { createApi } from '@reduxjs/toolkit/query/react'

import { baseQuery } from '@/shared/api/baseQuery'
import { ApiMethods, type MenuResponse } from '@/shared/api/types'
import { BASE_URL_OBJECT_ID } from '@/shared/config'

export const accessMenuApi = createApi({
	reducerPath: 'accessMenuApi',
	baseQuery,
	tagTypes: ['AccessMenu'],
	endpoints: build => ({
		getAccessMenu: build.query<MenuResponse[], void>({
			query: () => ({
				url: '',
				params: {
					object_id: BASE_URL_OBJECT_ID,
					method: ApiMethods.CHECK_USER_ROLE
				}
			}),
			providesTags: ['AccessMenu']
		})
	})
})

export const { useGetAccessMenuQuery } = accessMenuApi
export const selectMenuItems = accessMenuApi.endpoints.getAccessMenu.select()
