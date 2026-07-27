import { useQuery } from '@tanstack/react-query'

import { getAccessMenu } from '../api/accessMenuApi'

export const accessMenuQueryKeys = {
	all: ['access-menu'] as const
}

export const useAccessMenu = () =>
	useQuery({
		queryKey: accessMenuQueryKeys.all,
		queryFn: getAccessMenu,
		staleTime: 5 * 60_000
	})
