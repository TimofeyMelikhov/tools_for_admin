import type { ExcelRow } from '@/lib/excelParser'

export interface IInitialState {
	selectedAction: SelectOption | null
	excelObj: ExcelRow[]
	currentObj: IUploadList | null
	time?: string
}

export interface IInitialStateGroup {
	selectedAction: SelectOption | null
	excelObj: ExcelRow[]
	currentGroup: IUploadList | null
	usersToRemove: IPersonFromServer[]
}

export type excelObj = {
	excelObj: ExcelRow[]
}

export interface IPersonFromServer {
	id?: number
	fullname: string
	position_name: string
	position_parent_name: string
}

export interface IServerResponse {
	counterPersons: number
	notFoundPersons: ExcelRow[]
	dublicatePersons: IPersonFromServer[]
	prevAssign: ExcelRow[]
}

export interface IAdaptationAssign {
	countCreateAdapt: 0
	notFoundPersons: ExcelRow[]
	dublicatePersons: IPersonFromServer[]
	notFoundProgramm: string[]
	haveAProgramm: string[]
	haventPosDate: string[]
}

export interface IMenuResponse {
	id: number
	title: string
	route: string
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
