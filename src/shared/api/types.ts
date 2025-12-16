import type { Person } from '@/entities/person'

import type { ExcelRow } from '@/shared/lib/excel'

// FIX: общий базовый формат ответа "операции по Excel"
export type ExcelOperationResponse = {
	success?: boolean
	code?: number
	message?: string

	counterPersons?: number
	notFoundPersons?: ExcelRow[]
	dublicatePersons?: Person[]
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
