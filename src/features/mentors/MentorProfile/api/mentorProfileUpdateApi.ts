import { createApi } from '@reduxjs/toolkit/query/react'

import { BASE_URL_OBJECT_ID } from '@/app/config'

import { baseQuery } from '@/shared/api/baseQuery'
import { ApiMethods, type ExcelOperationResponse } from '@/shared/api/types'
import type { ExcelObj } from '@/shared/lib/excel'

export const mentorProfileApi = createApi({
	reducerPath: 'mentorProfileApi',
	baseQuery,
	endpoints: build => ({
		mentorProfile: build.mutation<ExcelOperationResponse, ExcelObj>({
			query: body => ({
				url: '',
				params: {
					object_id: BASE_URL_OBJECT_ID,
					method: ApiMethods.MENTORS_PROFILE_UPDATE
				},
				method: 'POST',
				body
			})
		})
	})
})

export const { useMentorProfileMutation } = mentorProfileApi
