import { useState } from 'react'

import { useExcelData } from '@/shared/lib/excel'
import type { ExcelRow } from '@/shared/lib/excel'

import { useAssignAdaptationMutation } from './queries'

export function useAssignAdaptation() {
	const {
		excelData: excelObj,
		onExcelParsed,
		clearExcel
	} = useExcelData()
	const [startDateAdapt, setStartDateAdapt] = useState<string | null>(null)
	const {
		mutateAsync: assignAdaptation,
		data,
		isPending: isLoading
	} = useAssignAdaptationMutation()

	const setStartDateValue = (value: string | null) => setStartDateAdapt(value)

	const submit = async (excelObj: ExcelRow[]) => {
		return assignAdaptation({
			excelObj,
			startDate: startDateAdapt
		})
	}

	return {
		excelObj,
		startDateAdapt,
		data,
		isLoading,

		onExcelParsed,
		clearExcel,
		setStartDateValue,
		submit
	}
}
