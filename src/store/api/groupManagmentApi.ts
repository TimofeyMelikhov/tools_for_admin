import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import type { IPersonFromServer, IUploadList } from '@/models/filtersModel'

import { backendId, baseServerPath } from '@/config/global'

export const groupManagmentApi = createApi({
	reducerPath: 'groupManagmentApi',
	baseQuery: fetchBaseQuery({
		baseUrl: baseServerPath,
		prepareHeaders(headers) {
			headers.set('Content-Type', 'application/json')
			return headers
		}
	}),
	endpoints: build => ({
		getGroupList: build.query<IUploadList[], void>({
			query: () =>
				`custom_web_template.html?object_id=${backendId}&method=getGroups`
		}),
		getPersonsGroup: build.mutation<IPersonFromServer[], IUploadList>({
			query: groupId => ({
				url: `custom_web_template.html?object_id=${backendId}&method=getPersonsGroup`,
				method: 'POST',
				body: groupId
			})
		})
	})
})

export const { useGetGroupListQuery, useGetPersonsGroupMutation } =
	groupManagmentApi
