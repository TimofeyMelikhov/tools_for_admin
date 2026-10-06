import { describe, expect, it } from 'vitest'

import {
	createManualQuestion,
	ensureMinimumAnswers,
	getManualQuestionValidationError,
	getManualQuestionValidationErrors,
	toExcelRow
} from './manualQuestion'

const createValidChoiceQuestion = () => ({
	...createManualQuestion(1),
	code: 'manual-question-1',
	title: 'Вопрос для проверки',
	question: 'Какой вариант верный?',
	answers: [
		{ id: 'first', text: 'Первый', matchingText: '', isCorrect: false },
		{ id: 'second', text: 'Второй', matchingText: '', isCorrect: true }
	]
})

describe('ручное добавление вопросов', () => {
	it('не создаёт варианты для вопроса с единственным выбором', () => {
		expect(createManualQuestion(1).answers).toHaveLength(0)
	})

	it('по умолчанию показывает ответы в случайном порядке', () => {
		expect(createManualQuestion(1).sequence_responses).toBe('Random')
	})

	it('принимает корректный вопрос с единственным выбором', () => {
		const question = createValidChoiceQuestion()

		expect(
			getManualQuestionValidationError(question, 1, [question.code])
		).toBeNull()
	})

	it('принимает один вариант для единственного выбора', () => {
		const question = {
			...createValidChoiceQuestion(),
			answers: [
				{
					id: 'only-answer',
					text: 'Единственный вариант',
					matchingText: '',
					isCorrect: true
				}
			]
		}

		expect(
			getManualQuestionValidationError(question, 1, [question.code])
		).toBeNull()
	})

	it('требует два варианта только для множественного выбора', () => {
		const question = {
			...createValidChoiceQuestion(),
			question_type: 'multiple_response' as const,
			answers: [
				{
					id: 'only-answer',
					text: 'Единственный вариант',
					matchingText: '',
					isCorrect: true
				}
			]
		}

		expect(
			getManualQuestionValidationErrors(question, [question.code])
		).toMatchObject({
			answers: 'Добавьте и заполните минимум два варианта ответа.'
		})
	})

	it('требует отметку правильного варианта для вопроса с выбором', () => {
		const question = {
			...createValidChoiceQuestion(),
			answers: createValidChoiceQuestion().answers.map(answer => ({
				...answer,
				isCorrect: false
			}))
		}

		expect(
			getManualQuestionValidationErrors(question, [question.code])
		).toMatchObject({
			correctAnswers: 'Отметьте ровно один правильный вариант.'
		})
	})

	it('позволяет оставить эталонный ответ пустым для текстового ввода', () => {
		const question = {
			...createManualQuestion(1),
			code: 'manual-input-1',
			title: 'Вопрос с вводом',
			question_type: 'gap_fill' as const,
			question: 'Введите ответ'
		}

		expect(
			getManualQuestionValidationError(question, 1, [question.code])
		).toBeNull()
	})

	it('добавляет два варианта после выбора множественного типа', () => {
		expect(ensureMinimumAnswers('multiple_response', [])).toHaveLength(2)
		expect(ensureMinimumAnswers('multiple_choice', [])).toHaveLength(0)
	})

	it('преобразует варианты и галочки в формат существующей загрузки', () => {
		const question = createValidChoiceQuestion()

		expect(toExcelRow(question)).toMatchObject({
			question_text: 'Первый#Второй',
			numbers_correct_answers: '2'
		})
	})

	it('преобразует пары соответствий для серверного обработчика', () => {
		const question = {
			...createManualQuestion(1),
			code: 'manual-match-1',
			title: 'Пары для проверки',
			question_type: 'match_item' as const,
			question: 'Сопоставьте элементы',
			answers: [
				{
					id: 'pair-1',
					text: 'Великобритания',
					matchingText: 'Лондон',
					isCorrect: false
				},
				{
					id: 'pair-2',
					text: 'Франция',
					matchingText: 'Париж',
					isCorrect: false
				}
			]
		}

		expect(
			getManualQuestionValidationErrors(question, [question.code])
		).toEqual({})
		expect(toExcelRow(question)).toMatchObject({
			numbers_correct_answers: '',
			match_pairs:
				'[{"left":"Великобритания","right":"Лондон"},{"left":"Франция","right":"Париж"}]'
		})
	})
})
