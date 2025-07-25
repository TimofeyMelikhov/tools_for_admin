import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { backendId, baseServerPath } from '@/config/global'
import type {
	IInitialState,
	IServerResponse,
	IUploadList
} from '@/models/filtersModel'

export const tutorApi = createApi({
	reducerPath: 'tutorApi',
	baseQuery: fetchBaseQuery({ baseUrl: baseServerPath }),
	endpoints: build => ({
		getCurrentList: build.query<IUploadList[], string>({
			query: method =>
				`custom_web_template.html?object_id=${backendId}&method=${method}`
		}),
		assignCourse: build.mutation<IServerResponse, IInitialState>({
			query: assignCourseObj => ({
				url: `custom_web_template.html?object_id=${backendId}&method=dataReducer`,
				method: 'POST',
				body: assignCourseObj
			}),
			transformResponse: (response: IServerResponse): IServerResponse => {
				return {
					...response,
					dublicatePersons: response.dublicatePersons.map(
						({ id, ...rest }) => rest
					)
				}
			}
		})
	})
})

export const { useGetCurrentListQuery, useAssignCourseMutation } = tutorApi
