import type { ColumnMap } from '@/shared/lib/excel'

export const uploadingQuestionsColumnMap: ColumnMap = [
	['Код (первичный ключ)', 'code'],
	['Заголовок', 'title'],
	['Тип вопроса', 'question_type'],
	['Вопрос', 'question'],
	['Вес вопроса (балл)', 'question_weight'],
	['Тексты вариантов ответа', 'question_text'],
	['Номера правильных ответов (начиная с 1)', 'numbers_correct_answers'],
	[
		'Следование вариантов ответов (если пусто - последовательно, если Random - случайно)',
		'sequence_responses'
	],
	['Длительность (секунд)', 'duration'],
	['Кол-во попыток ответа на вопрос', 'number_attempts'],
	[
		'Показывать правильный ответ (пусто - нет, иначе - да)',
		'show_correct_answer'
	],
	['Инструкция к вопросу (либо пусто)', 'instruction_question'],
	['Сообщение при верном ответе', 'message_correct_answer'],
	['Сообщение при ошибочном ответе', 'message_incorrect_answer'],
	['Комментарий к вопросу (или пусто)', 'comment_question']
]
