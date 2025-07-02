import type { ExcelRow } from '@/lib/excelParser'

export interface IInitialState {
	selectedAction: SelectOption | null
	excelObj: ExcelRow[]
	currentObj: IUploadList | null
	time?: string
}

export interface IServerResponse {
	counterPersons: number
	notFoundPersons: ExcelRow[]
}

export type SelectOption = {
	value: string
	label: string
}

export interface IUploadList {
	id: string
	code: string
	name: string
	modification_date: string
}
