import type { Person } from '@/entities/person'

import type { ExcelRow } from '@/shared/lib/excel'

export type GroupAction =
	| 'addToGroup'
	| 'deleteFromGroup'
	| 'moveToGroup'
	| 'installLeader'

export type ActionOption = {
	value: GroupAction
	label: string
}

export type UploadListItem = {
	id: string
	code: string
	name: string
	modification_date: string
}

export type CollaboratorOption = {
	value: string
	label: string
	employee: Person
}

export type SearchRequest = {
	search: string
}

export type GroupManagementState = {
	selectedAction: ActionOption | null
	excelObj: ExcelRow[]
	currentGroup: UploadListItem | null
	targetGroup: UploadListItem | null
	selectedUsers: Person[]
	selectedUser: Person | null
}

export type ManagementGroupResponse = {
	success: boolean
	code: number
	message: string
	counterPersons?: number
	notProcessed?: string[]
	notFoundPersons?: ExcelRow[]
	dublicatePersons?: Person[]
}
