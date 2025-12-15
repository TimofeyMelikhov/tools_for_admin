import type { Person } from '@/entities/person'

import type { ExcelRow } from '@/shared/lib/excel'

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
