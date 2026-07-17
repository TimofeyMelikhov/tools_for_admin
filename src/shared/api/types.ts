import type { Person } from '@/entities/person'

import type { ExcelRow } from '@/shared/lib/excel'

export type ApiResult<TData extends object = object> = {
	success?: boolean
	code?: number
	message?: string
} & TData

export type ExcelOperationResponse = ApiResult<{
	counterPersons?: number
	notFoundPersons?: ExcelRow[]
	dublicatePersons?: Person[]
	prevAssign?: ExcelRow[]
}>

export interface MenuResponse {
	id: number
	title: string
	route: string
	image: string
}

export interface SearchRequest {
	search: string
}

export interface ApiErrorResponse {
	success: false
	code: number
	message: string
}

export function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
	return (
		typeof value === 'object' &&
		value !== null &&
		'success' in value &&
		(value as { success?: unknown }).success === false &&
		'code' in value &&
		typeof (value as { code?: unknown }).code === 'number' &&
		'message' in value &&
		typeof (value as { message?: unknown }).message === 'string'
	)
}

export function getApiErrorMessage(error: unknown): string {
	if (
		typeof error === 'object' &&
		error !== null &&
		'response' in error &&
		isApiErrorResponse((error as { response?: { data?: unknown } }).response?.data)
	) {
		return (error as { response: { data: ApiErrorResponse } }).response.data
			.message
	}

	return isApiErrorResponse(error) ? error.message : ''
}

export const ApiMethods = {
	GET_COURSES: 'getCourses',
	GET_ASSESSMENTS: 'getAssessments',
	GET_GROUPS: 'getGroups',
	GET_COLLABORATORS: 'getCollaborators',
	CHECK_USER_ROLE: 'checkUserRole',
	ADD_TO_GROUP: 'addToGroup',
	DELETE_PERSON_FROM_GROUP: 'deletePersonFromGroup',
	MOVE_TO_GROUP: 'moveToGroup',
	INSTALL_LEADER: 'installLeader',
	GET_PERSONS_GROUP: 'getPersonsGroup',
	DATA_REDUCER: 'dataReducer',
	REWARDS_UPDATE: 'rewardsUpdate',
	MENTORS_PROFILE_UPDATE: 'mentorsProfileUpdate',
	CHECK_MENTORS_DATA: 'checkMentorsData',
	ASSIGN_ADAPTATION: 'assignAdaptation',
	UPLOADING_QUESTIONS: 'uploadingQuestions'
} as const
