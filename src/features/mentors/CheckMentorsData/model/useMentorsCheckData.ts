import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux'
import type { ExcelRow } from '@/shared/lib/excel'

import { useMentorsCheckDataMutation } from '../api/mentorsCheckDataApi'

import type { MentorCheckResultRow } from './mentorCheckData.types'
import { cleanExcelMentorCheckData, setExcelData } from './mentorCheckDataSlice'

export const useMentorsCheckData = () => {
	const dispatch = useAppDispatch()

	const [checkMentorData, { data, isLoading }] = useMentorsCheckDataMutation()

	const excelData = useAppSelector(state => state.mentorCheckData.excelObj)

	const excelLength = excelData.length

	const onExcelParsed = (rows: ExcelRow[]) => {
		dispatch(setExcelData(rows))
	}

	const clearExcel = () => {
		dispatch(cleanExcelMentorCheckData())
	}

	function mergeMentoringRows(
		sourceRows: ExcelRow[],
		mentorsRows: MentorCheckResultRow[]
	) {
		const byFullname = new Map()
		const byFullnameAndPosition = new Map()

		for (const m of mentorsRows) {
			const fullnameKey = String(m.fullname ?? '').trim()
			const positionKey = String(m.position_name ?? '').trim()

			if (fullnameKey) {
				byFullname.set(fullnameKey, m)

				byFullnameAndPosition.set(`${fullnameKey}__${positionKey}`, m)
			}
		}

		return sourceRows.map((row: MentorCheckResultRow) => {
			const mentorName = String(row.mentor ?? '').trim()
			const mentorPos = String(row.mentor_position_name ?? '').trim()

			const exactKey = `${mentorName}__${mentorPos}`
			const mentorInfo =
				byFullnameAndPosition.get(exactKey) ||
				byFullname.get(mentorName) ||
				null

			console.log(mentorInfo)
			console.log(row)

			const mentor_award_chick = mentorInfo?.mentor_award_chick ?? ''
			const mentor_award_owl = mentorInfo?.mentor_award_owl ?? ''
			const selection_procedure = mentorInfo?.selection_procedure ?? ''

			return {
				fullname: row.fullname,
				mentor: row.mentor,
				mentor_award_chick,
				mentor_award_owl,
				selection_procedure,
				date_modified: row.date_modified,
				position_name: row.position_name,
				mentor_position_name: row.mentor_position_name,
				mentor_subdivision: row.mentor_subdivision,
				state: row.state,
				type_of_mentoring: row.type_of_mentoring
			}
		})
	}

	const submit = async (excelObj: ExcelRow[]) => {
		return await checkMentorData({ excelObj }).unwrap()
	}

	return {
		excelData,
		excelLength,
		isLoading,
		data,
		onExcelParsed,
		clearExcel,
		mergeMentoringRows,
		submit
	}
}
