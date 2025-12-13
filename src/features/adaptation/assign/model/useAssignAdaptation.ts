import { useAssignAdaptationMutation } from '@/features/adaptation/assign/api/assignAdaptationApi'

import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux'
import type { ExcelRow } from '@/shared/lib/excel/types'

import {
	cleanExcelAdaptation,
	setExcelData,
	setStartDate
} from './assignAdaptationSlice'

export function useAssignAdaptation() {
	const dispatch = useAppDispatch()
	const [assignAdaptation, { data, isLoading }] = useAssignAdaptationMutation()

	const { excelObj, startDateAdapt } = useAppSelector(
		state => state.assignAdaptation
	)

	const onExcelParsed = (rows: ExcelRow[]) => dispatch(setExcelData(rows))
	const clearExcel = () => dispatch(cleanExcelAdaptation())
	const setStartDateValue = (value: string | null) =>
		dispatch(setStartDate(value))

	const submit = async (excelObj: ExcelRow[]) => {
		return await assignAdaptation({
			excelObj,
			startDate: startDateAdapt
		}).unwrap()
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
