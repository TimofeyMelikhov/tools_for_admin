import type { ButtonProps } from '@mui/material/Button'

import type { ColumnMap, ExcelRow } from '@/shared/lib/excel'

export type Primitive = string | number | boolean | null | undefined | Date

export type DownloadExcelButtonProps = {
	buttonText: string
	fileName: string
	data: ExcelRow[]
	columnMap: ColumnMap
	sheetName?: string
} & Omit<ButtonProps, 'onClick' | 'children'>
