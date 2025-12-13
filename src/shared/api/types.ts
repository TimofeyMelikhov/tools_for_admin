import type { ExcelRow } from '@/shared/lib/excel/types'

import type { Person } from '@/entities/person/model/types'

export interface ServerResponse {
	counterPersons: number
	notFoundPersons: ExcelRow[]
	dublicatePersons: Person[]
	prevAssign: ExcelRow[]
}

export interface ManagmentGroupResponse {
	success: boolean
	code: number
	message: string
	counterPersons: number
	notProcessed?: string[]
	notFoundPersons?: ExcelRow[]
	dublicatePersons?: Person[]
}

export interface AdaptationAssignResponse {
	countCreateAdapt: 0
	notFoundPersons: ExcelRow[]
	dublicatePersons: Person[]
	notFoundProgramm: string[]
	haveAProgramm: string[]
	haventPosDate: string[]
}

export interface MenuResponse {
	id: number
	title: string
	route: string
	image: string
}

export interface SearchRequest {
	search: string
}

export interface UploadListItem {
	id: string
	code: string
	name: string
	modification_date: string
}

export interface CollaboratorOption {
	value: number | undefined
	label: string
	employee: Person
}
