import type { GroupAction, GroupManagementState } from './types'

export const getGroupOperationValidationError = (
	actionValue: GroupAction | undefined,
	{ currentGroup, targetGroup, selectedUsers, selectedUser }: GroupManagementState
) => {
	if (!currentGroup) return 'Выберите группу'
	if (!actionValue) return null

	if (actionValue === 'moveToGroup' && !targetGroup) {
		return 'Выберите целевую группу для перемещения'
	}

	if (
		(actionValue === 'moveToGroup' || actionValue === 'deleteFromGroup') &&
		!selectedUsers.length
	) {
		return 'Выберите сотрудников'
	}

	if (actionValue === 'installLeader' && !selectedUser) {
		return 'Выберите руководителя группы'
	}

	return null
}
