import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import type { IServerResponse, excelObj } from '@/models/filtersModel'

import { backendId, baseServerPath } from '@/config/global'

export const employeApi = createApi({
	reducerPath: 'employeApi',
	baseQuery: fetchBaseQuery({ baseUrl: baseServerPath }),
	endpoints: build => ({
		updateRewards: build.mutation<IServerResponse, excelObj>({
			query: ExcelRow => ({
				url: `custom_web_template.html?object_id=${backendId}&method=rewardsUpdate`,
				method: 'POST',
				body: ExcelRow
			}),
			transformResponse: (response: IServerResponse): IServerResponse => {
				return {
					...response,
					dublicatePersons: response.dublicatePersons.map(
						({ id, ...rest }) => rest
					)
				}
			}
		}),
		mentorProfile: build.mutation<IServerResponse, excelObj>({
			query: ExcelRow => ({
				url: `custom_web_template.html?object_id=${backendId}&method=mentorsProfileUpdate`,
				method: 'POST',
				body: ExcelRow
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

export const { useUpdateRewardsMutation, useMentorProfileMutation } = employeApi
