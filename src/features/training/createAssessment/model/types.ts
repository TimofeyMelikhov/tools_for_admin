import type { ApiResult } from '@/shared/api/types'

export type AssessmentPlayerType = 'v3' | 'v4'
export type AssessmentSectionOrder = 'Sequential' | 'Random'
export type AssessmentSectionSelectionType = 'all' | 'num_generate'

export type AssessmentQuestion = {
	id: string
	code: string
	title: string
	type_id: string
	question_points: number
	creation_date: string
}

export type CreateAssessmentForm = {
	code: string
	title: string
	duration: number
	durationDays: number
	attemptsNum: number
	passingScore: number
	maxScore: number
	playerType: AssessmentPlayerType
	isOpen: boolean
	displayResultReport: boolean
	displayResult: boolean
	showFeedback: boolean
	showUnfinishedScore: boolean
}


export type AssessmentSection = {
	id: string
	code: string
	title: string
	duration: number
	passingScore: number
	order: AssessmentSectionOrder
	selectionType: AssessmentSectionSelectionType
	selectionNum: number
	questionIds: string[]
}

export type CreateAssessmentRequest = CreateAssessmentForm & {
	sections: Omit<AssessmentSection, 'id'>[]
}

export type CreateAssessmentResponse = ApiResult<{
	assessmentId: string
	assessmentCode: string
	questionCount: number
	published: boolean
}>
