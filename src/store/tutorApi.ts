import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { backendId, baseServerPath } from '@/config/global'
import type { IUploadList, IUploadRaw } from '@/models/filtersModel'

export const tutorApi = createApi({
	reducerPath: 'tutorApi',
	baseQuery: fetchBaseQuery({ baseUrl: baseServerPath }),
	endpoints: build => ({
		getCurrentList: build.query<IUploadList[], string>({
			query: method =>
				`custom_web_template.html?object_id=${backendId}&method=${method}`,
			transformResponse: (response: IUploadRaw[]) => {
				return response.map(item => ({
					id: item.id,
					code: item.code,
					name: item.name ?? item.title ?? '',
					modification_date: item.modification_date
				}))
			}
		})
	})
})

export const { useGetCurrentListQuery } = tutorApi
