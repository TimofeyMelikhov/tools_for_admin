import { GroupManagementWidget } from '@/features/groups/management'

export const InstallLeadWidget = () => (
	<GroupManagementWidget
		forcedAction='installLeader'
		title='Назначение руководителя группы'
		submitText='Установить руководителя'
	/>
)
