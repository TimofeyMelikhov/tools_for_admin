import { createApi } from '@reduxjs/toolkit/query/react'

import { backendId } from '@/app/config'

import type { Person } from '@/entities/person'

import { baseQuery } from '@/shared/api/baseQuery'

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
			query: () =>
				`custom_web_template.html?object_id=${backendId}&method=getGroups`,
			providesTags: ['Groups']
		}),

		getCollaborators: build.query<Person[], SearchRequest>({
			query: requestBody => ({
				url: `custom_web_template.html?object_id=${backendId}&method=getCollaborators`,
				method: 'POST',
				body: requestBody
			}),
			providesTags: ['Collaborators']
		}),

		getPersonsGroup: build.query<Person[], UploadListItem>({
			query: group => ({
				url: `custom_web_template.html?object_id=${backendId}&method=getPersonsGroup`,
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
				url: `custom_web_template.html?object_id=${backendId}&method=${method}`,
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
