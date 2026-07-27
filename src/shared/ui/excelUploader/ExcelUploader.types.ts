import type { ColumnMap, ExcelRow } from '@/shared/lib/excel/types'

type ExcelUploaderTexts = {
	button?: string
	loading?: string
	success?: string
	error?: string
}

export interface ExcelUploaderProps {
	columnMap: ColumnMap
	onSuccess: (data: ExcelRow[]) => void
	texts?: ExcelUploaderTexts
}
