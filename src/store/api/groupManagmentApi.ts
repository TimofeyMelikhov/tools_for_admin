import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import type { IPersonFromServer, IUploadList } from '@/models/filtersModel'

import { backendId, baseServerPath } from '@/config/global'

export const groupManagmentApi = createApi({
	reducerPath: 'groupManagmentApi',
	baseQuery: fetchBaseQuery({ baseUrl: baseServerPath }),
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
		// assignCourse: build.mutation<IServerResponse, IInitialState>({
		// 	query: assignCourseObj => ({
		// 		url: `custom_web_template.html?object_id=${backendId}&method=dataReducer`,
		// 		method: 'POST',
		// 		body: assignCourseObj
		// 	}),
		// 	transformResponse: (response: IServerResponse): IServerResponse => {
		// 		return {
		// 			...response,
		// 			dublicatePersons: response.dublicatePersons.map(
		// 				({ id, ...rest }) => rest
		// 			)
		// 		}
		// 	}
		// })
	})
})

export const { useGetGroupListQuery, useGetPersonsGroupMutation } =
	groupManagmentApi
