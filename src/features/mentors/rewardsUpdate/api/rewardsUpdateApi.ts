import { apiRequest } from '@/shared/api/client'
import { ApiMethods, type ExcelOperationResponse } from '@/shared/api/types'
import type { ExcelObj } from '@/shared/lib/excel'

export const updateRewards = (body: ExcelObj) =>
	apiRequest<ExcelOperationResponse, ExcelObj>({
		apiMethod: ApiMethods.REWARDS_UPDATE,
		body,
		httpMethod: 'post'
	})
