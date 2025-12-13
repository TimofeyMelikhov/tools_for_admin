export type ExcelRow = Record<string, string | number | null | undefined>

export type ColumnMap = ReadonlyArray<[rusHeader: string, fieldKey: string]>

export type ExcelObj = {
	excelObj: ExcelRow[]
}
