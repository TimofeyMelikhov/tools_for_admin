import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import type {
	IInitialStateGroup,
	IManagmentGroupResponse,
	IPersonFromServer,
	ISearchRequest,
	IUploadList
} from '@/models/filtersModel'

import { backendId, baseServerPath } from '@/config/global'

export const groupManagmentApi = createApi({
	reducerPath: 'groupManagmentApi',
	baseQuery: fetchBaseQuery({
		baseUrl: baseServerPath,
		prepareHeaders(headers) {
			headers.set('Content-Type', 'application/json')
			return headers
		}
	}),
	tagTypes: ['Groups', 'Collaborators', 'Persons', 'Managment'],
	endpoints: build => ({
		getGroupList: build.query<IUploadList[], void>({
			query: () =>
				`custom_web_template.html?object_id=${backendId}&method=getGroups`,
			providesTags: ['Groups']
		}),
		getCollaborators: build.query<IPersonFromServer[], ISearchRequest>({
			query: requestBody => ({
				url: `custom_web_template.html?object_id=${backendId}&method=getCollaborators`,
				method: 'POST',
				body: requestBody
			}),
			providesTags: ['Collaborators']
		}),
		getPersonsGroup: build.query<IPersonFromServer[], IUploadList>({
			query: groupId => ({
				url: `custom_web_template.html?object_id=${backendId}&method=getPersonsGroup`,
				method: 'POST',
				body: groupId
			}),
			providesTags: ['Persons']
		}),
		manageGroup: build.mutation<
			IManagmentGroupResponse,
			{
				method:
					| 'addToGroup'
					| 'deletePersonFromGroup'
					| 'moveToGroup'
					| 'installLeader'
				data: IInitialStateGroup
				targetGroupId?: string
			}
		>({
			query: ({ method, data, targetGroupId }) => ({
				url: `custom_web_template.html?object_id=${backendId}&method=${method}`,
				method: 'POST',
				body: targetGroupId ? { ...data, targetGroupId } : data
			}),
			invalidatesTags: ['Managment']
		})
	})
})

export const {
	useGetGroupListQuery,
	useLazyGetPersonsGroupQuery,
	useManageGroupMutation,
	useLazyGetCollaboratorsQuery
} = groupManagmentApi
