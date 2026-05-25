import type { ActionNavItem } from '@/shared/ui/actionChooser'

export const trainingManagementActions: ActionNavItem[] = [
	{
		title: 'Назначить курс',
		description: 'Назначение выбранного курса сотрудникам из списка',
		to: 'course'
	},
	{
		title: 'Назначить тест',
		description: 'Назначение выбранного теста сотрудникам из списка',
		to: 'assessment'
	},
	{
		title: 'Загрузить вопросы теста',
		description: 'Загрузка вопросов теста из шаблона excel',
		to: 'questions'
	}
]
