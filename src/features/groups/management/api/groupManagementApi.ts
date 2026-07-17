import type { Person } from '@/entities/person'

import { apiRequest } from '@/shared/api/client'
import { ApiMethods } from '@/shared/api/types'

import type {
	GroupManagementState,
	ManagementGroupResponse,
	SearchRequest,
	UploadListItem
} from '../model/types'

export type ManageGroupRequest = {
	method: Extract<
		(typeof ApiMethods)[keyof typeof ApiMethods],
		'addToGroup' | 'deletePersonFromGroup' | 'moveToGroup' | 'installLeader'
	>
	data: GroupManagementState
	targetGroupId?: string
}

export const getGroupList = () =>
	apiRequest<UploadListItem[]>({ apiMethod: ApiMethods.GET_GROUPS })

export const getCollaborators = (body: SearchRequest) =>
	apiRequest<Person[], SearchRequest>({
		apiMethod: ApiMethods.GET_COLLABORATORS,
		body,
		httpMethod: 'post'
	})

export const getPersonsGroup = (body: UploadListItem) =>
	apiRequest<Person[], UploadListItem>({
		apiMethod: ApiMethods.GET_PERSONS_GROUP,
		body,
		httpMethod: 'post'
	})

export const manageGroup = ({ method, data, targetGroupId }: ManageGroupRequest) =>
	apiRequest<ManagementGroupResponse, GroupManagementState & { targetGroupId?: string }>({
		apiMethod: method,
		body: targetGroupId ? { ...data, targetGroupId } : data,
		httpMethod: 'post'
	})
