import { createApi } from '@reduxjs/toolkit/query/react'

import { backendId } from '@/app/config'

import { baseQuery } from '@/shared/api/baseQuery'
import { stripDuplicateIds } from '@/shared/api/transform'
import type { ServerResponse } from '@/shared/api/types'
import type { ExcelObj } from '@/shared/lib/excel/types'

export const rewardsUpdateApi = createApi({
	reducerPath: 'rewardsUpdateApi',
	baseQuery,
	endpoints: build => ({
		updateRewards: build.mutation<ServerResponse, ExcelObj>({
			query: body => ({
				url: `custom_web_template.html?object_id=${backendId}&method=rewardsUpdate`,
				method: 'POST',
				body
			}),
			transformResponse: stripDuplicateIds
		})
	})
})

export const { useUpdateRewardsMutation } = rewardsUpdateApi
