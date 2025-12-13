import type { ExcelRow } from '@/shared/lib/excel/types'

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

export type Person = {
	id?: number
	fullname: string
	position_name: string
	position_parent_name: string
}

export type CollaboratorOption = {
	value: number | undefined
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
	searchString: string
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
