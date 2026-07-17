import { useMutation, useQuery } from '@tanstack/react-query'

import { assignTraining, getCurrentList } from '../api/trainingAssignApi'

export const trainingAssignQueryKeys = {
	all: ['training-assign'] as const,
	currentList: (method: string) =>
		[...trainingAssignQueryKeys.all, 'current-list', method] as const
}

export const useCurrentList = (method: string) =>
	useQuery({
		queryKey: trainingAssignQueryKeys.currentList(method),
		queryFn: () => getCurrentList(method),
		enabled: Boolean(method)
	})

export const useAssignTraining = () =>
	useMutation({ mutationFn: assignTraining })
