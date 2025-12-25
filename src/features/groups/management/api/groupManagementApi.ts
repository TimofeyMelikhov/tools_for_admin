import { createApi } from '@reduxjs/toolkit/query/react'

import type { Person } from '@/entities/person'

import { baseQuery } from '@/shared/api/baseQuery'
import { ApiMethods } from '@/shared/api/types'
import { BASE_URL_OBJECT_ID } from '@/shared/config'

import type {
	GroupManagementState,
	ManagementGroupResponse,
	SearchRequest,
	UploadListItem
} from '../model/types'

export const groupManagementApi = createApi({
	reducerPath: 'groupManagementApi',
	baseQuery,
	tagTypes: ['Groups', 'Collaborators', 'Persons', 'Management'],
	endpoints: build => ({
		getGroupList: build.query<UploadListItem[], void>({
			query: () => ({
				url: '',
				params: {
					object_id: BASE_URL_OBJECT_ID,
					method: ApiMethods.GET_GROUPS
				}
			}),
			providesTags: ['Groups']
		}),

		getCollaborators: build.query<Person[], SearchRequest>({
			query: requestBody => ({
				url: '',
				params: {
					object_id: BASE_URL_OBJECT_ID,
					method: ApiMethods.GET_COLLABORATORS
				},
				method: 'POST',
				body: requestBody
			}),
			providesTags: ['Collaborators']
		}),

		getPersonsGroup: build.query<Person[], UploadListItem>({
			query: group => ({
				url: '',
				params: {
					object_id: BASE_URL_OBJECT_ID,
					method: ApiMethods.GET_PERSONS_GROUP
				},
				method: 'POST',
				body: group
			}),
			providesTags: ['Persons']
		}),

		manageGroup: build.mutation<
			ManagementGroupResponse,
			{
				method:
					| 'addToGroup'
					| 'deletePersonFromGroup'
					| 'moveToGroup'
					| 'installLeader'
				data: GroupManagementState
				targetGroupId?: string
			}
		>({
			query: ({ method, data, targetGroupId }) => ({
				url: '',
				params: {
					object_id: BASE_URL_OBJECT_ID,
					method
				},
				method: 'POST',
				body: targetGroupId ? { ...data, targetGroupId } : data
			}),
			invalidatesTags: result =>
				result?.success ? ['Management', 'Persons'] : ['Management']
		})
	})
})

export const {
	useGetGroupListQuery,
	useGetPersonsGroupQuery,
	useGetCollaboratorsQuery,
	useManageGroupMutation
} = groupManagementApi
