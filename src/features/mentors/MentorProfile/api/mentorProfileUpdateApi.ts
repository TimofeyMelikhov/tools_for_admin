import { apiRequest } from '@/shared/api/client'
import { ApiMethods, type ExcelOperationResponse } from '@/shared/api/types'
import type { ExcelObj } from '@/shared/lib/excel'

export const updateMentorProfile = (body: ExcelObj) =>
	apiRequest<ExcelOperationResponse, ExcelObj>({
		apiMethod: ApiMethods.MENTORS_PROFILE_UPDATE,
		body,
		httpMethod: 'post'
	})
