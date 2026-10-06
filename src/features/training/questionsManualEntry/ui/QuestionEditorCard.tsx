import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Alert,
	Box,
	Button,
	Checkbox,
	Chip,
	FormControlLabel,
	IconButton,
	MenuItem,
	Stack,
	TextField,
	Typography
} from '@mui/material'
import {
	MdAdd,
	MdArrowDownward,
	MdArrowUpward,
	MdDeleteOutline,
	MdExpandMore
} from 'react-icons/md'

import {
	getAnswersHelperText,
	getMinimumAnswerCount,
	getQuestionTypeLabel,
	hasAnswerOptions,
	hasCorrectAnswerMarks,
	hasImplicitAnswerOrder,
	hasMatchPairs,
	questionTypeOptions,
	type EditableQuestionField,
	type ManualQuestion,
	type ManualQuestionValidationErrors,
	type QuestionType
} from '../model/manualQuestion'

import styles from './ManualQuestionsWidget.module.scss'

type QuestionEditorCardProps = {
	question: ManualQuestion
	questionNumber: number
	totalQuestions: number
	expanded: boolean
	errors?: ManualQuestionValidationErrors
	onToggle: () => void
	onFieldChange: (field: EditableQuestionField, value: string) => void
	onTypeChange: (value: QuestionType) => void
	onAddAnswer: () => void
	onAnswerTextChange: (answerId: string, value: string) => void
	onAnswerMatchingTextChange: (answerId: string, value: string) => void
	onAnswerCorrectChange: (answerId: string, isCorrect: boolean) => void
	onRemoveAnswer: (answerId: string) => void
	onMoveAnswer: (answerId: string, direction: 'up' | 'down') => void
	onRemoveQuestion: () => void
	onValidate: () => void
}

export const QuestionEditorCard = ({
	question,
	questionNumber,
	totalQuestions,
	expanded,
	errors,
	onToggle,
	onFieldChange,
	onTypeChange,
	onAddAnswer,
	onAnswerTextChange,
	onAnswerMatchingTextChange,
	onAnswerCorrectChange,
	onRemoveAnswer,
	onMoveAnswer,
	onRemoveQuestion,
	onValidate
}: QuestionEditorCardProps) => {
	const hasAnswerMarks = hasCorrectAnswerMarks(question.question_type)
	const isOrderQuestion = hasImplicitAnswerOrder(question.question_type)
	const isMatchQuestion = hasMatchPairs(question.question_type)
	const isInput = !hasAnswerOptions(question.question_type)
	const minimumAnswers = getMinimumAnswerCount(question.question_type)
	const answerLabel = isInput ? 'Допустимый ответ' : 'Вариант ответа'
	const answerSectionTitle = isMatchQuestion
		? 'Пары соответствий'
		: isInput
			? 'Допустимые ответы'
			: 'Варианты ответа'
	const answerError = errors?.answers || errors?.correctAnswers

	return (
		<Box className={styles.questionCard}>
			<Accordion
				className={styles.questionAccordion}
				expanded={expanded}
				onChange={onToggle}
				disableGutters
			>
				<AccordionSummary
				expandIcon={<MdExpandMore />}
				aria-controls={`question-${question.id}-content`}
				id={`question-${question.id}-header`}
				className={styles.questionSummary}
			>
				<Box className={styles.summaryContent}>
					<Box>
						<Typography variant='h6'>Вопрос {questionNumber}</Typography>
						<Typography color='text.secondary' variant='body2' noWrap>
							{question.title.trim() || 'Без заголовка'} ·{' '}
							{getQuestionTypeLabel(question.question_type)}
						</Typography>
					</Box>
					{errors && Object.keys(errors).length > 0 && (
						<Chip color='error' label='Есть ошибки' size='small' />
					)}
				</Box>
				</AccordionSummary>
				<AccordionDetails id={`question-${question.id}-content`}>
				<div className={styles.formGrid}>
					<TextField
						label='Код'
						required
						value={question.code}
						onChange={event => onFieldChange('code', event.target.value)}
						onBlur={onValidate}
						error={Boolean(errors?.code)}
						helperText={errors?.code || 'Уникальный код в этой загрузке.'}
						fullWidth
					/>
					<TextField
						label='Заголовок'
						required
						value={question.title}
						onChange={event => onFieldChange('title', event.target.value)}
						onBlur={onValidate}
						error={Boolean(errors?.title)}
						helperText={errors?.title || 'Короткое название для списка вопросов.'}
						fullWidth
					/>
					<TextField
						label='Тип вопроса'
						select
						required
						value={question.question_type}
						onChange={event =>
							onTypeChange(event.target.value as QuestionType)
						}
						onBlur={onValidate}
						fullWidth
					>
						{questionTypeOptions.map(option => (
							<MenuItem key={option.value} value={option.value}>
								{option.label}
							</MenuItem>
						))}
					</TextField>
					<TextField
						label='Балл'
						type='number'
						required
						value={question.score}
						onChange={event => onFieldChange('score', event.target.value)}
						onBlur={onValidate}
						error={Boolean(errors?.score)}
						helperText={errors?.score || 'Не меньше 0.'}
						inputProps={{ min: 0, step: 0.1 }}
						fullWidth
					/>
					<TextField
						className={styles.fullWidth}
						label='Текст вопроса'
						required
						multiline
						minRows={3}
						value={question.question}
						onChange={event => onFieldChange('question', event.target.value)}
						onBlur={onValidate}
						error={Boolean(errors?.question)}
						helperText={errors?.question}
						fullWidth
					/>
				</div>

				<Box className={styles.answerSection}>
					<Box className={styles.answerSectionHeader}>
						<Box>
							<Typography variant='subtitle1'>{answerSectionTitle}</Typography>
							<Typography color='text.secondary' variant='body2'>
								{getAnswersHelperText(question.question_type)}
							</Typography>
						</Box>
						<Button
							startIcon={<MdAdd />}
							size='small'
							onClick={onAddAnswer}
						>
							{isMatchQuestion ? 'Добавить пару' : 'Добавить вариант'}
						</Button>
					</Box>

					{answerError && (
						<Alert className={styles.answerError} severity='error'>
							{answerError}
						</Alert>
					)}

					<Stack spacing={1.5}>
						{question.answers.map((answer, index) => (
							<Box
								className={[
									styles.answerRow,
									isOrderQuestion && styles.orderAnswerRow,
									hasAnswerMarks && styles.choiceAnswerRow,
									isMatchQuestion && styles.matchAnswerRow,
									isInput && styles.inputAnswerRow
								]
									.filter(Boolean)
									.join(' ')}
								key={answer.id}
							>
								{isOrderQuestion && (
									<Stack className={styles.orderControls} spacing={0}>
										<IconButton
											aria-label={`Поднять вариант ${index + 1}`}
											disabled={index === 0}
											onClick={() => onMoveAnswer(answer.id, 'up')}
											size='small'
										>
											<MdArrowUpward />
										</IconButton>
										<IconButton
											aria-label={`Опустить вариант ${index + 1}`}
											disabled={index === question.answers.length - 1}
											onClick={() => onMoveAnswer(answer.id, 'down')}
											size='small'
										>
											<MdArrowDownward />
										</IconButton>
									</Stack>
								)}
								<TextField
									label={
										isMatchQuestion
											? `Элемент ${index + 1}`
											: `${answerLabel} ${index + 1}`
									}
									required={!isInput}
									value={answer.text}
									onChange={event =>
										onAnswerTextChange(answer.id, event.target.value)
									}
									onBlur={onValidate}
									error={Boolean(errors?.answers)}
									fullWidth
								/>
								{isMatchQuestion && (
									<TextField
										label='Соответствующий элемент'
										required
										value={answer.matchingText}
										onChange={event =>
											onAnswerMatchingTextChange(answer.id, event.target.value)
										}
										onBlur={onValidate}
										error={Boolean(errors?.answers)}
										fullWidth
									/>
								)}
								{hasAnswerMarks && (
									<FormControlLabel
										className={styles.correctAnswerControl}
										control={
											<Checkbox
												checked={answer.isCorrect}
												onChange={event =>
													onAnswerCorrectChange(answer.id, event.target.checked)
												}
											/>
										}
										label='Верный'
									/>
								)}
								<IconButton
									aria-label={`Удалить вариант ${index + 1}`}
									disabled={question.answers.length <= minimumAnswers}
									onClick={() => onRemoveAnswer(answer.id)}
								>
									<MdDeleteOutline />
								</IconButton>
							</Box>
						))}
					</Stack>
				</Box>

				<Accordion className={styles.advancedSettings} disableGutters elevation={0}>
					<AccordionSummary expandIcon={<MdExpandMore />}>
						<Typography>Дополнительные настройки</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<div className={styles.formGrid}>
							<TextField
								label='Порядок показа ответов'
								select
								value={question.sequence_responses}
								onChange={event =>
									onFieldChange('sequence_responses', event.target.value)
								}
								fullWidth
							>
								<MenuItem value='Sequential'>По порядку</MenuItem>
								<MenuItem value='Random'>Случайно</MenuItem>
							</TextField>
							<TextField
								label='Длительность, секунд'
								type='number'
								value={question.duration}
								onChange={event => onFieldChange('duration', event.target.value)}
								onBlur={onValidate}
								error={Boolean(errors?.duration)}
								helperText={errors?.duration}
								inputProps={{ min: 0 }}
								fullWidth
							/>
							<TextField
								label='Количество попыток'
								type='number'
								value={question.number_attempts}
								onChange={event =>
									onFieldChange('number_attempts', event.target.value)
								}
								onBlur={onValidate}
								error={Boolean(errors?.number_attempts)}
								helperText={errors?.number_attempts}
								inputProps={{ min: 1, step: 1 }}
								fullWidth
							/>
							<TextField
								label='Показывать правильный ответ'
								select
								value={question.show_correct_answer}
								onChange={event =>
									onFieldChange('show_correct_answer', event.target.value)
								}
								fullWidth
							>
								<MenuItem value='0'>Нет</MenuItem>
								<MenuItem value='1'>Да</MenuItem>
							</TextField>
							<TextField
								label='Инструкция к вопросу'
								multiline
								minRows={2}
								value={question.instruction_question}
								onChange={event =>
									onFieldChange('instruction_question', event.target.value)
								}
								fullWidth
							/>
							<TextField
								label='Сообщение при верном ответе'
								multiline
								minRows={2}
								value={question.message_correct_answer}
								onChange={event =>
									onFieldChange('message_correct_answer', event.target.value)
								}
								fullWidth
							/>
							<TextField
								label='Сообщение при неверном ответе'
								multiline
								minRows={2}
								value={question.message_incorrect_answer}
								onChange={event =>
									onFieldChange('message_incorrect_answer', event.target.value)
								}
								fullWidth
							/>
							<TextField
								className={styles.fullWidth}
								label='Комментарий к вопросу'
								multiline
								minRows={2}
								value={question.comment_question}
								onChange={event =>
									onFieldChange('comment_question', event.target.value)
								}
								fullWidth
							/>
						</div>
					</AccordionDetails>
				</Accordion>
				</AccordionDetails>
			</Accordion>
			<Box className={styles.summaryActions}>
				<IconButton
					aria-label={`Удалить вопрос ${questionNumber}`}
					disabled={totalQuestions === 1}
					onClick={onRemoveQuestion}
				>
					<MdDeleteOutline />
				</IconButton>
			</Box>
		</Box>
	)
}
