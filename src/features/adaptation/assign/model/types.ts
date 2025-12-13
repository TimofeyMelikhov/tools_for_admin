import type { Person } from '@/entities/person/model/types'

import type { ExcelRow } from '@/shared/lib/excel/types'

export type AssignAdaptationRequest = {
	excelObj: ExcelRow[]
	startDate: string | null
}

export type AssignAdaptationResponse = {
	countCreateAdapt: number
	notFoundPersons: ExcelRow[]
	dublicatePersons: Person[]
	haveAProgramm: string[]
	notFoundProgramm: string[]
	haventPosDate: string[]
}
