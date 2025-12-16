import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux'
import type { ExcelRow } from '@/shared/lib/excel'

import { useMentorsCheckDataMutation } from '../api/mentorsCheckDataApi'

import { cleanExcelMentorCheckData, setExcelData } from './mentorCheckDataSlice'

export const useMentorsCheckData = () => {
	const dispatch = useAppDispatch()

	const [updateMentorProfile, { data, isLoading }] =
		useMentorsCheckDataMutation()

	const excelData = useAppSelector(state => state.mentorCheckData.excelObj)

	const excelLength = excelData.length

	const onExcelParsed = (rows: ExcelRow[]) => {
		dispatch(setExcelData(rows))
	}

	const clearExcel = () => {
		dispatch(cleanExcelMentorCheckData())
	}

	const submit = async (excelObj: ExcelRow[]) => {
		return await updateMentorProfile({ excelObj }).unwrap()
		// console.log('Submitted data:', excelObj)
	}

	return {
		excelData,
		excelLength,
		isLoading,
		data,
		onExcelParsed,
		clearExcel,
		submit
	}
}
