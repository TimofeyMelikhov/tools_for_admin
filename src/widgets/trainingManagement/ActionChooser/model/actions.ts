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
		title: 'Создать тест',
		description: 'Создание теста и выбор вопросов, загруженных за последние сутки',
		to: 'create-assessment'
	},
	{
		title: 'Загрузить вопросы теста',
		description: 'Загрузка вопросов теста из шаблона excel',
		to: 'questions'
	}
]
