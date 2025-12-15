import type { ActionNavItem } from '@/shared/ui/actionChooser'

export const mentorManagementActions: ActionNavItem[] = [
	{
		title: 'Награды за наставничество',
		description: 'Установка и обновление наград наставникам.',
		to: 'RewardsUpdate'
	},
	{
		title: 'Процедура отбора',
		description: 'Установка дат процедуры отбора наставников.',
		to: 'MentorProfile'
	},
	{
		title: 'Сверка данных с 1С',
		description: 'Проверка данных наставников на основе информации из 1С.',
		to: 'checkData'
	}
]
