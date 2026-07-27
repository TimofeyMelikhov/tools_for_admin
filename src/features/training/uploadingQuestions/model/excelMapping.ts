import type { ColumnMap } from '@/shared/lib/excel'

export const uploadingQuestionsColumnMap: ColumnMap = [
	['Код', 'code'],
	['Заголовок', 'title'],
	['Тип вопроса', 'question_type'],
	['Вопрос', 'question'],
	['Балл', 'score'],
	['Ответы', 'question_text'],
	['Номера правильных ответов', 'numbers_correct_answers'],
	['Следование ответов', 'sequence_responses'],
	['Длительность (секунд)', 'duration'],
	['Кол-во попыток', 'number_attempts'],
	['Показывать правильный ответ', 'show_correct_answer'],
	['Инструкция к вопросу', 'instruction_question'],
	['Сообщение при верном ответе', 'message_correct_answer'],
	['Сообщение при ошибочном ответе', 'message_incorrect_answer'],
	['Комментарий к вопросу', 'comment_question']
]
