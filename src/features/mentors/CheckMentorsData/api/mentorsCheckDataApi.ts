import { createApi } from '@reduxjs/toolkit/query/react'

import { baseQuery } from '@/shared/api/baseQuery'
import { ApiMethods } from '@/shared/api/types'
import { BASE_URL_OBJECT_ID } from '@/shared/config'
import type { ExcelObj } from '@/shared/lib/excel'

import type { MentorsCheckDataResponse } from '../model/mentorCheckData.types'

export const mentorsCheckDataApi = createApi({
	reducerPath: 'mentorsCheckDataApi',
	baseQuery,
	endpoints: build => ({
		mentorsCheckData: build.mutation<MentorsCheckDataResponse, ExcelObj>({
			query: body => ({
				url: '',
				params: {
					object_id: BASE_URL_OBJECT_ID,
					method: ApiMethods.CHECK_MENTORS_DATA
				},
				method: 'POST',
				body
			})
		})
	})
})

export const { useMentorsCheckDataMutation } = mentorsCheckDataApi
