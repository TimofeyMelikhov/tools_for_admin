import { GroupManagementWidget } from '@/features/groups/management'

export const MovePersonWidget = () => (
	<GroupManagementWidget
		forcedAction='moveToGroup'
		title='Перемещение сотрудников между группами'
		submitText='Переместить сотрудников'
	/>
)
