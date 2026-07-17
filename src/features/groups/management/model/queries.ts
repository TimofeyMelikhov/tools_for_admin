import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
	getCollaborators,
	getGroupList,
	getPersonsGroup,
	manageGroup
} from '../api/groupManagementApi'

import type { UploadListItem } from './types'

export const groupManagementQueryKeys = {
	all: ['group-management'] as const,
	groups: () => [...groupManagementQueryKeys.all, 'groups'] as const,
	collaborators: (search: string) =>
		[...groupManagementQueryKeys.all, 'collaborators', search] as const,
	persons: () => [...groupManagementQueryKeys.all, 'persons'] as const,
	personsGroup: (groupId: string) =>
		[...groupManagementQueryKeys.persons(), groupId] as const
}

export const useGroupList = () =>
	useQuery({ queryKey: groupManagementQueryKeys.groups(), queryFn: getGroupList })

export const useCollaborators = (search: string, enabled: boolean) =>
	useQuery({
		queryKey: groupManagementQueryKeys.collaborators(search),
		queryFn: () => getCollaborators({ search }),
		enabled
	})

export const usePersonsGroup = (group: UploadListItem | null, enabled: boolean) =>
	useQuery({
		queryKey: groupManagementQueryKeys.personsGroup(group?.id ?? ''),
		queryFn: () => getPersonsGroup(group as UploadListItem),
		enabled
	})

export const useManageGroup = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: manageGroup,
		onSuccess: result => {
			if (result.success) {
				void queryClient.invalidateQueries({
					queryKey: groupManagementQueryKeys.persons()
				})
			}
		}
	})
}
