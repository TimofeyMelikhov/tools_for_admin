import { useMutation, useQuery } from '@tanstack/react-query'

import { createAssessment, getRecentQuestions } from '../api/createAssessmentApi'

export const createAssessmentQueryKeys = {
	all: ['create-assessment'] as const,
	recentQuestions: () =>
		[...createAssessmentQueryKeys.all, 'recent-questions'] as const
}

export const useRecentQuestions = () =>
	useQuery({
		queryKey: createAssessmentQueryKeys.recentQuestions(),
		queryFn: getRecentQuestions
	})

export const useCreateAssessment = () =>
	useMutation({ mutationFn: createAssessment })
