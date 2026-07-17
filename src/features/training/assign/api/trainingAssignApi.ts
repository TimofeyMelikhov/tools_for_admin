import { apiRequest } from '@/shared/api/client'
import { ApiMethods, type ExcelOperationResponse } from '@/shared/api/types'

import type { TrainingAssignRequest, UploadListItem } from '../model/types'

export const getCurrentList = (method: string) =>
	apiRequest<UploadListItem[]>({ apiMethod: method })

export const assignTraining = (body: TrainingAssignRequest) =>
	apiRequest<ExcelOperationResponse, TrainingAssignRequest>({
		apiMethod: ApiMethods.DATA_REDUCER,
		body,
		httpMethod: 'post'
	})
