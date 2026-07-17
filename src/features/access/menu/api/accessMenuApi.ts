import { apiRequest } from '@/shared/api/client'
import { ApiMethods, type MenuResponse } from '@/shared/api/types'

export const getAccessMenu = () =>
	apiRequest<MenuResponse[]>({ apiMethod: ApiMethods.CHECK_USER_ROLE })
