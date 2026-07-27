import { useMemo } from 'react'

import { useDebounce } from '@/shared/hooks/useDebounce'

import {
	useCollaborators,
	useGroupList,
	usePersonsGroup
} from './queries'
import type {
	CollaboratorOption,
	GroupAction,
	GroupManagementState
} from './types'

type Params = Pick<
	GroupManagementState,
	'currentGroup' | 'selectedUser' | 'excelObj'
> & {
	actionValue?: GroupAction
	searchInput: string
}

export const useGroupManagementData = ({
	actionValue,
	currentGroup,
	selectedUser,
	excelObj,
	searchInput
}: Params) => {
	const { data: groups = [], isLoading: groupsLoading } = useGroupList()
	const filteredGroups = useMemo(
		() => groups.filter(group => group.id !== currentGroup?.id),
		[groups, currentGroup?.id]
	)

	const showPersonsList =
		actionValue === 'deleteFromGroup' ||
		actionValue === 'moveToGroup' ||
		actionValue === 'installLeader'
	const needPersons = Boolean(currentGroup && showPersonsList)
	const personsQuery = usePersonsGroup(currentGroup, needPersons)

	const debouncedSearch = useDebounce(searchInput, 500).trim().toLowerCase()
	const canSearch =
		actionValue === 'addToGroup' || actionValue === 'installLeader'
	const shouldSearch = canSearch && debouncedSearch.length >= 2
	const collaboratorsQuery = useCollaborators(debouncedSearch, shouldSearch)

	const collaboratorsOptions = useMemo<CollaboratorOption[]>(() => {
		if (!shouldSearch) return []

		return (collaboratorsQuery.data ?? []).map(employee => ({
			value: employee.id,
			label: `${employee.fullname} (${employee.position_name})`,
			employee
		}))
	}, [collaboratorsQuery.data, shouldSearch])

	return {
		groups,
		filteredGroups,
		groupsLoading,
		personsList: needPersons ? personsQuery.data : undefined,
		personsListLoading: needPersons ? personsQuery.isFetching : false,
		collaboratorsOptions,
		collaboratorsLoading: shouldSearch ? collaboratorsQuery.isFetching : false,
		showPersonsList,
		showExcelUploader:
			actionValue === 'addToGroup' && !selectedUser && excelObj.length === 0
	}
}
