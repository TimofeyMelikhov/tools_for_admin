import { useState } from 'react'

import { Alert, Box, Button, Stack, Typography } from '@mui/material'
import { enqueueSnackbar } from 'notistack'
import { MdAdd, MdUnfoldLess, MdUnfoldMore } from 'react-icons/md'

import { useUploadingQuestionsMutation } from '@/features/training/uploadingQuestions/model/queries'
import { getApiErrorMessage } from '@/shared/api/types'
import { Preloader } from '@/shared/ui/preloader'

import {
	createManualAnswer,
	createManualQuestion,
	ensureMinimumAnswers,
	getMinimumAnswerCount,
	getManualQuestionValidationErrors,
	isInputQuestion,
	toExcelRow,
	type EditableQuestionField,
	type ManualQuestion,
	type ManualQuestionValidationErrors,
	type QuestionType
} from '../model/manualQuestion'

import { QuestionEditorCard } from './QuestionEditorCard'
import styles from './ManualQuestionsWidget.module.scss'

const createInitialQuestions = () => [createManualQuestion(1)]

export const ManualQuestionsWidget = () => {
	const [questions, setQuestions] = useState<ManualQuestion[]>(
		createInitialQuestions
	)
	const [expandedQuestionIds, setExpandedQuestionIds] = useState<
		string[] | null
	>(null)
	const [validationErrors, setValidationErrors] = useState<
		Record<string, ManualQuestionValidationErrors>
	>({})
	const { mutateAsync: uploadQuestions, isPending } =
		useUploadingQuestionsMutation()

	const clearQuestionErrors = (questionId: string) => {
		setValidationErrors(previous => {
			if (!previous[questionId]) return previous

			const next = { ...previous }
			delete next[questionId]
			return next
		})
	}

	const updateQuestion = (
		questionId: string,
		field: EditableQuestionField,
		value: string
	) => {
		setQuestions(previous =>
			previous.map(question =>
				question.id === questionId
					? ({ ...question, [field]: value } as ManualQuestion)
					: question
			)
		)
		clearQuestionErrors(questionId)
	}

	const updateQuestionType = (questionId: string, questionType: QuestionType) => {
		setQuestions(previous =>
			previous.map(question =>
				question.id === questionId
					? {
							...question,
							question_type: questionType,
							answers: isInputQuestion(questionType)
								? question.answers.filter(answer => answer.text.trim())
								: questionType === 'multiple_response'
									? ensureMinimumAnswers(questionType, question.answers)
									: question.answers.filter(answer => answer.text.trim())
						}
					: question
			)
		)
		clearQuestionErrors(questionId)
	}

	const updateAnswerMatchingText = (
		questionId: string,
		answerId: string,
		value: string
	) => {
		setQuestions(previous =>
			previous.map(question =>
				question.id === questionId
					? {
							...question,
							answers: question.answers.map(answer =>
								answer.id === answerId
									? { ...answer, matchingText: value }
									: answer
							)
						}
					: question
			)
		)
		clearQuestionErrors(questionId)
	}

	const updateAnswerText = (questionId: string, answerId: string, value: string) => {
		setQuestions(previous =>
			previous.map(question =>
				question.id === questionId
					? {
							...question,
							answers: question.answers.map(answer =>
								answer.id === answerId ? { ...answer, text: value } : answer
							)
						}
					: question
			)
		)
		clearQuestionErrors(questionId)
	}

	const updateAnswerCorrectness = (
		questionId: string,
		answerId: string,
		isCorrect: boolean
	) => {
		setQuestions(previous =>
			previous.map(question => {
				if (question.id !== questionId) return question

				return {
					...question,
					answers: question.answers.map(answer => ({
						...answer,
						isCorrect:
							question.question_type === 'multiple_choice'
								? answer.id === answerId && isCorrect
								: answer.id === answerId
									? isCorrect
									: answer.isCorrect
					}))
				}
			})
		)
		clearQuestionErrors(questionId)
	}

	const addAnswer = (questionId: string) => {
		setQuestions(previous =>
			previous.map(question =>
				question.id === questionId
					? { ...question, answers: [...question.answers, createManualAnswer()] }
					: question
			)
		)
		clearQuestionErrors(questionId)
	}

	const removeAnswer = (questionId: string, answerId: string) => {
		setQuestions(previous =>
			previous.map(question => {
				if (question.id !== questionId) return question

				const minimumAnswers = getMinimumAnswerCount(question.question_type)
				if (question.answers.length <= minimumAnswers) return question

				return {
					...question,
					answers: question.answers.filter(answer => answer.id !== answerId)
				}
			})
		)
		clearQuestionErrors(questionId)
	}

	const moveAnswer = (
		questionId: string,
		answerId: string,
		direction: 'up' | 'down'
	) => {
		setQuestions(previous =>
			previous.map(question => {
				if (question.id !== questionId) return question

				const currentIndex = question.answers.findIndex(
					answer => answer.id === answerId
				)
				const nextIndex = currentIndex + (direction === 'up' ? -1 : 1)
				if (currentIndex < 0 || nextIndex < 0 || nextIndex >= question.answers.length) {
					return question
				}

				const answers = [...question.answers]
				;[answers[currentIndex], answers[nextIndex]] = [
					answers[nextIndex],
					answers[currentIndex]
				]

				return { ...question, answers }
			})
		)
		clearQuestionErrors(questionId)
	}

	const validateQuestion = (questionId: string) => {
		const question = questions.find(item => item.id === questionId)
		if (!question) return

		const questionCodes = questions.map(item => item.code.trim())
		const errors = getManualQuestionValidationErrors(question, questionCodes)

		setValidationErrors(previous => {
			if (Object.keys(errors).length === 0) {
				const next = { ...previous }
				delete next[questionId]
				return next
			}

			return { ...previous, [questionId]: errors }
		})
	}

	const addQuestion = () => {
		const newQuestion = createManualQuestion(questions.length + 1)

		setQuestions(previous => [...previous, newQuestion])
		setExpandedQuestionIds(previous => [
			...(previous ?? questions.map(question => question.id)),
			newQuestion.id
		])
	}

	const removeQuestion = (questionId: string) => {
		setQuestions(previous =>
			previous.length === 1
				? previous
				: previous.filter(question => question.id !== questionId)
		)
		setExpandedQuestionIds(previous =>
			previous?.filter(id => id !== questionId) ?? null
		)
		clearQuestionErrors(questionId)
	}

	const toggleQuestion = (questionId: string) => {
		setExpandedQuestionIds(previous => {
			const current = previous ?? questions.map(question => question.id)

			return current.includes(questionId)
				? current.filter(id => id !== questionId)
				: [...current, questionId]
		})
	}

	const submit = async () => {
		const questionCodes = questions.map(question => question.code.trim())
		const errorsByQuestion = questions.reduce<
			Record<string, ManualQuestionValidationErrors>
		>((result, question) => {
			const errors = getManualQuestionValidationErrors(question, questionCodes)
			if (Object.keys(errors).length > 0) result[question.id] = errors

			return result
		}, {})

		if (Object.keys(errorsByQuestion).length > 0) {
			setValidationErrors(errorsByQuestion)
			setExpandedQuestionIds(Object.keys(errorsByQuestion))
			enqueueSnackbar('Проверьте поля, выделенные красным.', {
				variant: 'warning'
			})
			return
		}

		try {
			const result = await uploadQuestions({
				excelObj: questions.map(toExcelRow)
			})
			const savedCount = result.counterPersons ?? questions.length
			enqueueSnackbar(`Опубликовано вопросов: ${savedCount}.`, {
				variant: 'success'
			})
			setQuestions(createInitialQuestions())
			setExpandedQuestionIds(null)
			setValidationErrors({})
		} catch (error) {
			enqueueSnackbar(
				getApiErrorMessage(error) ||
					'Не удалось опубликовать вопросы. Повторите попытку.',
				{ variant: 'error' }
			)
		}
	}

	return (
		<div className={styles.container}>
			<Box className={styles.pageHeader}>
				<Box>
					<Typography variant='h4' gutterBottom>
						Ручное добавление вопросов
					</Typography>
					<Typography color='text.secondary'>
						Создавайте вопросы карточками: ненужные сейчас можно свернуть.
					</Typography>
				</Box>
				<Stack direction='row' spacing={1}>
					<Button
						startIcon={<MdUnfoldLess />}
						size='small'
						onClick={() => setExpandedQuestionIds([])}
					>
						Свернуть все
					</Button>
					<Button
						startIcon={<MdUnfoldMore />}
						size='small'
						onClick={() =>
							setExpandedQuestionIds(questions.map(question => question.id))
						}
					>
						Развернуть все
					</Button>
				</Stack>
			</Box>

			<Alert severity='info' sx={{ mb: 2 }}>
				Поля со звёздочкой обязательны. Добавляйте варианты кнопкой внутри
				карточки и отмечайте правильные ответами галочками.
			</Alert>

			<Stack spacing={2}>
				{questions.map((question, index) => (
					<QuestionEditorCard
						key={question.id}
						question={question}
						questionNumber={index + 1}
						totalQuestions={questions.length}
						expanded={
							expandedQuestionIds === null
								? index === 0
								: expandedQuestionIds.includes(question.id)
						}
						errors={validationErrors[question.id]}
						onToggle={() => toggleQuestion(question.id)}
						onFieldChange={(field, value) =>
							updateQuestion(question.id, field, value)
						}
						onTypeChange={value => updateQuestionType(question.id, value)}
						onAddAnswer={() => addAnswer(question.id)}
						onAnswerTextChange={(answerId, value) =>
							updateAnswerText(question.id, answerId, value)
						}
						onAnswerMatchingTextChange={(answerId, value) =>
							updateAnswerMatchingText(question.id, answerId, value)
						}
						onAnswerCorrectChange={(answerId, isCorrect) =>
							updateAnswerCorrectness(question.id, answerId, isCorrect)
						}
						onRemoveAnswer={answerId => removeAnswer(question.id, answerId)}
						onMoveAnswer={(answerId, direction) =>
							moveAnswer(question.id, answerId, direction)
						}
						onRemoveQuestion={() => removeQuestion(question.id)}
						onValidate={() => validateQuestion(question.id)}
					/>
				))}
			</Stack>

			<Box className={styles.actions}>
				<Button variant='outlined' startIcon={<MdAdd />} onClick={addQuestion}>
					Добавить вопрос
				</Button>
				<Button variant='contained' disabled={isPending} onClick={submit}>
					Сохранить и опубликовать вопросы
				</Button>
			</Box>

			{isPending && <Preloader />}
		</div>
	)
}
