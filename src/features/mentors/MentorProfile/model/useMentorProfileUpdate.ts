import { useMentorProfileMutation } from '@/features/mentors/MentorProfile/api/mentorProfileUpdateApi'
import {
	cleanExcelMentorProfile,
	setExcelData
} from '@/features/mentors/MentorProfile/model/mentorProfileSlice'

import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux'
import type { ExcelRow } from '@/shared/lib/excel/types'

export function useMentorProfileUpdate() {
	const dispatch = useAppDispatch()

	const [updateMentorProfile, { data, isLoading }] = useMentorProfileMutation()

	const excelData = useAppSelector(state => state.mentorProfile.excelObj)
	const excelLength = useAppSelector(
		state => state.mentorProfile.excelObj.length
	)

	const onExcelParsed = (rows: ExcelRow[]) => {
		dispatch(setExcelData(rows))
	}

	const clearExcel = () => {
		dispatch(cleanExcelMentorProfile())
	}

	const submit = async (excelObj: ExcelRow[]) => {
		return await updateMentorProfile({ excelObj }).unwrap()
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
