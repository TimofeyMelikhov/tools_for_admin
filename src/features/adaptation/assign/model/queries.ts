import { useMutation } from '@tanstack/react-query'

import { assignAdaptation } from '../api/assignAdaptationApi'

export const useAssignAdaptationMutation = () =>
	useMutation({ mutationFn: assignAdaptation })
