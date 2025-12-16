import { createApi } from '@reduxjs/toolkit/query/react'

import { backendId } from '@/app/config'

import { baseQuery } from '@/shared/api/baseQuery'
import type { ExcelObj } from '@/shared/lib/excel'

import type { MentorsCheckDataResponse } from '../model/mentorCheckData.types'

export const mentorsCheckDataApi = createApi({
	reducerPath: 'mentorsCheckDataApi',
	baseQuery,
	endpoints: build => ({
		mentorsCheckData: build.mutation<MentorsCheckDataResponse, ExcelObj>({
			query: body => ({
				url: `custom_web_template.html?object_id=${backendId}&method=checkMentorsData`,
				method: 'POST',
				body
			})
		})
	})
})

export const { useMentorsCheckDataMutation } = mentorsCheckDataApi
