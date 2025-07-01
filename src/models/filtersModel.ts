import type { ExcelRow } from '@/lib/excelParser'

export interface IInitialState {
	selectedAction: SelectOption | null
	excelObj: ExcelRow[]
	currentObj: IUploadList | null
	time?: string
}

export type SelectOption = {
	value: string
	label: string
}

export interface IUploadRaw {
	id: string
	code: string
	title?: string // условно: может быть undefined, если это не «тесты»
	name?: string // условно: может быть undefined, если это «тесты», а не «курсы/группы»
	modification_date: string
}

export interface IUploadList {
	id: string
	code: string
	name: string
	modification_date: string
}
