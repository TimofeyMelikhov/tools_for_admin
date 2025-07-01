import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { backendId, baseServerPath } from '@/config/global'
import type { IInitialState, IUploadList } from '@/models/filtersModel'

export const tutorApi = createApi({
	reducerPath: 'tutorApi',
	baseQuery: fetchBaseQuery({ baseUrl: baseServerPath }),
	endpoints: build => ({
		getCurrentList: build.query<IUploadList[], string>({
			query: method =>
				`custom_web_template.html?object_id=${backendId}&method=${method}`
		}),
		assignCourse: build.mutation<IInitialState[], any>({
			query: assignCourseObj => ({
				url: `custom_web_template.html?object_id=${backendId}&method=assignCourse`,
				method: 'POST',
				body: assignCourseObj
			})
		})
	})
})

export const { useGetCurrentListQuery, useAssignCourseMutation } = tutorApi
