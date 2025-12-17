import type { Person } from '@/entities/person'

import type { ExcelRow } from '@/shared/lib/excel'

export type ExcelOperationResponse = {
	success?: boolean
	code?: number
	message?: string

	counterPersons?: number
	notFoundPersons?: ExcelRow[]
	dublicatePersons?: Person[]
	prevAssign?: ExcelRow[]
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
