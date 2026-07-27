import { apiRequest } from '@/shared/api/client'
import { ApiMethods } from '@/shared/api/types'

import type {
	AssessmentQuestion,
	CreateAssessmentRequest,
	CreateAssessmentResponse
} from '../model/types'

export const getRecentQuestions = () =>
	apiRequest<AssessmentQuestion[]>({
		apiMethod: ApiMethods.GET_RECENT_QUESTIONS,
		httpMethod: 'post'
	})

export const createAssessment = (body: CreateAssessmentRequest) =>
	apiRequest<CreateAssessmentResponse, CreateAssessmentRequest>({
		apiMethod: ApiMethods.CREATE_ASSESSMENT,
		body,
		httpMethod: 'post'
	})
