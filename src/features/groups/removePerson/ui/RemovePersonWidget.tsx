import { GroupManagementWidget } from '@/features/groups/management'

export const RemovePersonWidget = () => (
	<GroupManagementWidget
		forcedAction='deleteFromGroup'
		title='Удаление сотрудников из группы'
		submitText='Удалить сотрудников'
	/>
)
