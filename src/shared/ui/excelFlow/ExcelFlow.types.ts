import type React from 'react'

import type { ColumnMap, ExcelRow } from '@/shared/lib/excel'

export type ExcelFlowResult<TDuplicateRow = unknown, TNotFoundRow = unknown> = {
	success?: boolean
	code?: number
	message?: string

	counterPersons?: number
	dublicatePersons?: TDuplicateRow[]
	notFoundPersons?: TNotFoundRow[]
}

export type ExcelFlowTexts = {
	title: string
	subtitle?: string

	previewTitle: string
	clearButton: string

	submitButton: string

	successToast: string
	errorToast: string
	warningToast?: (args: { processed: number; total: number }) => string

	duplicatesTitle?: string
	notFoundTitle?: string
}

export type ExcelFlowClasses = {
	container?: string
	tableTitle?: string
	errorsBlock?: string
}

export type ExcelFlowProps<TRes extends ExcelFlowResult = ExcelFlowResult> = {
	columnMap: ColumnMap
	errorsColumnMap?: ColumnMap
	excelData: ExcelRow[]
	excelLength: number

	isLoading: boolean
	result?: TRes

	onExcelParsed: (rows: ExcelRow[]) => void
	onClear: () => void

	onSubmit: (excelObj: ExcelRow[]) => Promise<TRes>

	texts: ExcelFlowTexts
	classes?: ExcelFlowClasses

	controlsSlot?: React.ReactNode
	submitDisabled?: boolean
	renderErrors?: (result?: TRes) => React.ReactNode
}
