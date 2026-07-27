import type { ExcelOperationResponse } from '@/shared/api/types'
import type { ExcelRow } from '@/shared/lib/excel'

export type MentorCheckExcelRow = ExcelRow

export type MentorCheckResultRow = ExcelRow & {
	mentor_award_chick?: string
	mentor_award_owl?: string
	selection_procedure?: string
}

export type MentorsCheckDataResponse = ExcelOperationResponse & {
	rows?: MentorCheckResultRow[]
}
