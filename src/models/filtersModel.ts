import type { ExcelRow } from '@/lib/excelParser'

export interface IInitialState {
	selectedAction: SelectOption | null
	excelObj: ExcelRow[]
	currentObj: IUploadList | null
	time?: string
}

interface IPersonFromServer {
	id: string
	fullname: string
	position_name: string
	position_parent_name: string
}

export interface IServerResponse {
	counterPersons: number
	notFoundPersons: ExcelRow[]
	dublicatePersons: IPersonFromServer[]
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
