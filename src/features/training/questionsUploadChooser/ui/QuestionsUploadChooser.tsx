import { ActionChooser } from '@/shared/ui/actionChooser'

const questionUploadActions = [
	{
		title: 'Загрузить из Excel',
		description: 'Загрузка вопросов из заполненного шаблона Excel',
		to: 'excel'
	},
	{
		title: 'Добавить вручную',
		description: 'Заполнение формы и публикация нескольких вопросов',
		to: 'manual'
	}
]

export const QuestionsUploadChooser = () => (
	<ActionChooser
		title='Выберите способ загрузки вопросов:'
		items={questionUploadActions}
	/>
)
