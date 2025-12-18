import type { ExcelRow } from '@/shared/lib/excel'

export type TrainingAction = 'getCourses' | 'getAssessments'

export type ActionOption = {
	value: TrainingAction
	label: string
}

export type UploadListItem = {
	id: string
	code: string
	name: string
	modification_date: string
}

export type TrainingAssignState = {
	selectedAction: ActionOption | null
	currentObj: UploadListItem | null
	excelObj: ExcelRow[]
	time: string
}

export type TrainingAssignRequest = {
	selectedAction: ActionOption | null
	currentObj: UploadListItem | null
	excelObj: ExcelRow[]
	time: string
}

export type Props = {
	forcedAction?: TrainingAction
	title?: string
	submitText?: string
}
