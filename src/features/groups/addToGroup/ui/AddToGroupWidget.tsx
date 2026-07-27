import { GroupManagementWidget } from '@/features/groups/management'

export const AddToGroupWidget = () => (
	<GroupManagementWidget
		forcedAction='addToGroup'
		title='Добавление сотрудников в группу'
		submitText='Добавить сотрудников'
	/>
)
