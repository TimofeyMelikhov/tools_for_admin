import { createApi } from '@reduxjs/toolkit/query/react'

import { backendId } from '@/app/config'

import { baseQuery } from '@/shared/api/baseQuery'
import type { ExcelOperationResponse } from '@/shared/api/types'
import type { ExcelObj } from '@/shared/lib/excel'

export const mentorProfileApi = createApi({
	reducerPath: 'mentorProfileApi',
	baseQuery,
	endpoints: build => ({
		mentorProfile: build.mutation<ExcelOperationResponse, ExcelObj>({
			query: body => ({
				url: `custom_web_template.html?object_id=${backendId}&method=mentorsProfileUpdate`,
				method: 'POST',
				body
			})
		})
	})
})

export const { useMentorProfileMutation } = mentorProfileApi
