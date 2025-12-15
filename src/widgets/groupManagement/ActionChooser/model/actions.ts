import type { ActionNavItem } from '@/shared/ui/actionChooser'

export const groupManagementActions: ActionNavItem[] = [
	{
		title: 'Добавить пользователей',
		description: 'Добавить пользователей в выбранную группу',
		to: 'add'
	},
	{
		title: 'Удалить пользователей',
		description: 'Удалить пользователей из выбранной группы',
		to: 'remove'
	},
	{
		title: 'Переместить пользователей',
		description: 'Переместить пользователей из одной группы в другую',
		to: 'move'
	},
	{
		title: 'Установить руководителя',
		description: 'Установить руководителя для выбранной группы',
		to: 'leader'
	}
]
