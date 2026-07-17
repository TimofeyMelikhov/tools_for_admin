import { apiRequest } from '@/shared/api/client'
import { ApiMethods } from '@/shared/api/types'
import type { ExcelObj } from '@/shared/lib/excel'

import type { MentorsCheckDataResponse } from '../model/mentorCheckData.types'

export const checkMentorsData = (body: ExcelObj) =>
	apiRequest<MentorsCheckDataResponse, ExcelObj>({
		apiMethod: ApiMethods.CHECK_MENTORS_DATA,
		body,
		httpMethod: 'post'
	})
