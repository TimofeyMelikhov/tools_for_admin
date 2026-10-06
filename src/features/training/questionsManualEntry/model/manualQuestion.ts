import type { ExcelRow } from '@/shared/lib/excel'

export type QuestionType =
	| 'multiple_choice'
	| 'multiple_response'
	| 'order'
	| 'gap_fill'
	| 'numerical_fill_in_blank'
	| 'match_item'

export type ManualAnswer = {
	id: string
	text: string
	matchingText: string
	isCorrect: boolean
}

export type ManualQuestion = {
	id: string
	code: string
	title: string
	question_type: QuestionType
	question: string
	score: string
	answers: ManualAnswer[]
	sequence_responses: 'Sequential' | 'Random'
	duration: string
	number_attempts: string
	show_correct_answer: '0' | '1'
	instruction_question: string
	message_correct_answer: string
	message_incorrect_answer: string
	comment_question: string
}

export type EditableQuestionField = Exclude<
	keyof ManualQuestion,
	'id' | 'answers'
>

export type ManualQuestionValidationField =
	| 'code'
	| 'title'
	| 'question'
	| 'score'
	| 'answers'
	| 'correctAnswers'
	| 'duration'
	| 'number_attempts'

export type ManualQuestionValidationErrors = Partial<
	Record<ManualQuestionValidationField, string>
>

export const questionTypeOptions: ReadonlyArray<{
	value: QuestionType
	label: string
}> = [
	{ value: 'multiple_choice', label: 'Единственный выбор' },
	{ value: 'multiple_response', label: 'Множественный выбор' },
	{ value: 'order', label: 'Ранжирование' },
	{ value: 'gap_fill', label: 'Текстовый ввод' },
	{ value: 'numerical_fill_in_blank', label: 'Цифровой ввод' },
	{ value: 'match_item', label: 'Соответствие' }
]

const choiceQuestionTypes: QuestionType[] = [
	'multiple_choice',
	'multiple_response'
]

const inputQuestionTypes: QuestionType[] = [
	'gap_fill',
	'numerical_fill_in_blank'
]

const createAnswerId = () =>
	`answer-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

export const createManualAnswer = (): ManualAnswer => ({
	id: createAnswerId(),
	text: '',
	matchingText: '',
	isCorrect: false
})

export const createManualQuestion = (number: number): ManualQuestion => ({
	id: `question-${number}-${Date.now()}`,
	code: '',
	title: '',
	question_type: 'multiple_choice',
	question: '',
	score: '1',
	answers: [],
	sequence_responses: 'Random',
	duration: '',
	number_attempts: '1',
	show_correct_answer: '0',
	instruction_question: '',
	message_correct_answer: '',
	message_incorrect_answer: '',
	comment_question: ''
})

export const hasCorrectAnswerMarks = (questionType: QuestionType) =>
	choiceQuestionTypes.includes(questionType)

export const isInputQuestion = (questionType: QuestionType) =>
	inputQuestionTypes.includes(questionType)

export const hasAnswerOptions = (questionType: QuestionType) =>
	!isInputQuestion(questionType)

export const hasImplicitAnswerOrder = (questionType: QuestionType) =>
	questionType === 'order'

export const hasMatchPairs = (questionType: QuestionType) =>
	questionType === 'match_item'

export const getInitialAnswerCount = (questionType: QuestionType) =>
	questionType === 'multiple_response' ? 2 : 0

export const getMinimumAnswerCount = (questionType: QuestionType) =>
	getInitialAnswerCount(questionType)

export const getRequiredAnswerCount = (questionType: QuestionType) =>
	questionType === 'multiple_response'
		? 2
		: hasAnswerOptions(questionType)
			? 1
			: 0

export const ensureMinimumAnswers = (
	questionType: QuestionType,
	answers: ManualAnswer[]
) => {
	const missingCount = Math.max(getInitialAnswerCount(questionType) - answers.length, 0)

	return [
		...answers,
		...Array.from({ length: missingCount }, createManualAnswer)
	]
}

export const getAnswersHelperText = (questionType: QuestionType) => {
	if (isInputQuestion(questionType)) {
		return 'Необязательно. Добавьте допустимые ответы, если их нужно проверить автоматически.'
	}

	if (hasMatchPairs(questionType)) {
		return 'Добавьте пары: элемент слева и соответствующий ему элемент справа.'
	}

	if (hasImplicitAnswerOrder(questionType)) {
		return 'Добавьте варианты в правильном порядке: сверху будет первый.'
	}

	if (questionType === 'multiple_choice') {
		return 'Добавьте хотя бы один вариант и отметьте его как верный.'
	}

	return 'Добавьте минимум два варианта и отметьте все верные.'
}

export const getQuestionTypeLabel = (questionType: QuestionType) =>
	questionTypeOptions.find(option => option.value === questionType)?.label ??
	questionType

const getFilledAnswers = (answers: ManualAnswer[]) =>
	answers.filter(answer => answer.text.trim())

const getFilledMatchPairs = (answers: ManualAnswer[]) =>
	answers.filter(answer => answer.text.trim() && answer.matchingText.trim())

export const toExcelRow = (question: ManualQuestion): ExcelRow => {
	const answers = getFilledAnswers(question.answers)
	const matchPairs = getFilledMatchPairs(question.answers)
	const numbersCorrectAnswers = hasCorrectAnswerMarks(question.question_type)
		? answers
				.map((answer, index) => (answer.isCorrect ? index + 1 : null))
				.filter((index): index is number => index !== null)
				.join('#')
		: ''

	return {
		code: question.code,
		title: question.title,
		question_type: question.question_type,
		question: question.question,
		score: question.score,
		question_text: hasMatchPairs(question.question_type)
			? matchPairs.map(answer => answer.text.trim()).join('#')
			: answers.map(answer => answer.text.trim()).join('#'),
		match_pairs: hasMatchPairs(question.question_type)
			? JSON.stringify(
					matchPairs.map(answer => ({
						left: answer.text.trim(),
						right: answer.matchingText.trim()
					}))
				)
			: '',
		numbers_correct_answers: numbersCorrectAnswers,
		sequence_responses: question.sequence_responses,
		duration: question.duration,
		number_attempts: question.number_attempts,
		show_correct_answer: question.show_correct_answer,
		instruction_question: question.instruction_question,
		message_correct_answer: question.message_correct_answer,
		message_incorrect_answer: question.message_incorrect_answer,
		comment_question: question.comment_question
	}
}

export const getManualQuestionValidationErrors = (
	question: ManualQuestion,
	questionCodes: string[]
): ManualQuestionValidationErrors => {
	const errors: ManualQuestionValidationErrors = {}
	const answerOptions = getFilledAnswers(question.answers)
	const matchPairs = getFilledMatchPairs(question.answers)
	const correctAnswers = answerOptions.filter(answer => answer.isCorrect)
	const score = Number(question.score)
	const duration = Number(question.duration)
	const attempts = Number(question.number_attempts)

	const code = question.code.trim()

	if (!code) errors.code = 'Укажите код вопроса.'
	if (code && questionCodes.filter(questionCode => questionCode === code).length > 1) {
		errors.code = 'Код должен быть уникальным в текущей загрузке.'
	}
	if (!question.title.trim()) errors.title = 'Укажите заголовок вопроса.'
	if (!question.question.trim()) errors.question = 'Укажите текст вопроса.'
	if (!question.score.trim() || !Number.isFinite(score) || score < 0) {
		errors.score = 'Укажите балл не меньше 0.'
	}
	if (hasMatchPairs(question.question_type)) {
		if (
			question.answers.some(
				answer => Boolean(answer.text.trim()) !== Boolean(answer.matchingText.trim())
			)
		) {
			errors.answers = 'Заполните обе части пары или удалите незаполненную строку.'
	} else if (matchPairs.length < getRequiredAnswerCount(question.question_type)) {
		errors.answers =
			getRequiredAnswerCount(question.question_type) === 1
				? 'Добавьте и заполните хотя бы одну пару соответствий.'
				: 'Добавьте и заполните минимум две пары соответствий.'
		}
	} else if (
		question.answers.length > 0 &&
		(!isInputQuestion(question.question_type) || answerOptions.length > 0) &&
		question.answers.some(answer => !answer.text.trim())
	) {
		errors.answers = 'Заполните или удалите пустые варианты.'
	} else if (answerOptions.length < getRequiredAnswerCount(question.question_type)) {
		errors.answers =
			getRequiredAnswerCount(question.question_type) === 1
				? 'Добавьте и заполните хотя бы один вариант ответа.'
				: 'Добавьте и заполните минимум два варианта ответа.'
	}
	if (question.duration.trim() && (!Number.isFinite(duration) || duration < 0)) {
		errors.duration = 'Укажите длительность не меньше 0.'
	}
	if (
		question.number_attempts.trim() &&
		(!Number.isInteger(attempts) || attempts < 1)
	) {
		errors.number_attempts =
			'Количество попыток должно быть целым числом не меньше 1.'
	}

	if (hasCorrectAnswerMarks(question.question_type)) {
		if (question.question_type === 'multiple_choice' && correctAnswers.length !== 1) {
			errors.correctAnswers = 'Отметьте ровно один правильный вариант.'
		}
		if (question.question_type !== 'multiple_choice' && correctAnswers.length === 0) {
			errors.correctAnswers = 'Отметьте хотя бы один правильный вариант.'
		}
	}

	return errors
}

export const getManualQuestionValidationError = (
	question: ManualQuestion,
	questionNumber: number,
	questionCodes: string[]
) => {
	const firstError = Object.values(
		getManualQuestionValidationErrors(question, questionCodes)
	)[0]

	return firstError ? `Вопрос ${questionNumber}: ${firstError}` : null
}
