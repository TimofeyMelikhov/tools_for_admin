import { createApi } from '@reduxjs/toolkit/query/react'

import { backendId } from '@/app/config'

import { baseQuery } from '@/shared/api/baseQuery'
import type { ServerResponse } from '@/shared/api/types'
import type { ExcelObj } from '@/shared/lib/excel'

export const mentorsCheckDataApi = createApi({
	reducerPath: 'mentorsCheckDataApi',
	baseQuery,
	endpoints: build => ({
		mentorsCheckData: build.mutation<ServerResponse, ExcelObj>({
			query: body => ({
				url: `custom_web_template.html?object_id=${backendId}&method=mentorsProfileUpdate`,
				method: 'POST',
				body
			})
		})
	})
})

export const { useMentorsCheckDataMutation } = mentorsCheckDataApi
