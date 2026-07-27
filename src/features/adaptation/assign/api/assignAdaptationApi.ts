import { apiRequest } from '@/shared/api/client'
import { ApiMethods } from '@/shared/api/types'

import type {
	AssignAdaptationRequest,
	AssignAdaptationResponse
} from '../model/types'

export const assignAdaptation = (body: AssignAdaptationRequest) =>
	apiRequest<AssignAdaptationResponse, AssignAdaptationRequest>({
		apiMethod: ApiMethods.ASSIGN_ADAPTATION,
		body,
		httpMethod: 'post'
	})
