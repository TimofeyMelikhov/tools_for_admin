import { useCallback, useState } from 'react'

import type { ExcelRow } from './types'

export const useExcelData = () => {
	const [excelData, setExcelData] = useState<ExcelRow[]>([])

	const onExcelParsed = useCallback((rows: ExcelRow[]) => {
		setExcelData(rows)
	}, [])

	const clearExcel = useCallback(() => {
		setExcelData([])
	}, [])

	return {
		excelData,
		excelLength: excelData.length,
		onExcelParsed,
		clearExcel
	}
}
