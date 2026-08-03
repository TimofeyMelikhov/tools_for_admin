import { useState } from 'react'

import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Alert,
	Box,
	Button,
	FormControl,
	FormControlLabel,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	Stack,
	Switch,
	TextField,
	Typography
} from '@mui/material'
import { enqueueSnackbar } from 'notistack'
import { MdAdd, MdExpandMore } from 'react-icons/md'

import { getApiErrorMessage } from '@/shared/api/types'
import { Preloader } from '@/shared/ui/preloader'

import { useCreateAssessment, useRecentQuestions } from '../model/queries'
import type { AssessmentSection, CreateAssessmentForm } from '../model/types'

import { AssessmentSectionCard } from './AssessmentSectionCard'
import styles from './createAssessment.module.scss'

const initialForm: CreateAssessmentForm = {
	code: '',
	title: '',
	duration: 30,
	durationDays: 0,
	attemptsNum: 1,
	passingScore: 0,
	maxScore: 0,
	playerType: 'v3',
	isOpen: false,
	displayResultReport: false,
	displayResult: false,
	showFeedback: true,
	showUnfinishedScore: false
}

const createSection = (number: number): AssessmentSection => ({
	id: `section-${number}-${Date.now()}`,
	code: String(number),
	title: `Раздел ${number}`,
	duration: 0,
	passingScore: 0,
	order: 'Sequential',
	selectionType: 'all',
	selectionNum: 0,
	questionIds: []
})

const createInitialSections = () => [createSection(1)]

const normalizeAssessmentCode = (value: string) =>
	value.replace(/[^A-Za-z0-9\-_]/g, '')

export const CreateAssessmentWidget = () => {
	const [form, setForm] = useState<CreateAssessmentForm>(initialForm)
	const [sections, setSections] = useState<AssessmentSection[]>(
		createInitialSections
	)
	const {
		data: questions = [],
		isLoading: isQuestionsLoading,
		isError: isQuestionsError,
		error: questionsError
	} = useRecentQuestions()
	const { mutateAsync: createAssessment, isPending: isCreating } =
		useCreateAssessment()

	const selectedQuestionsCount = sections.reduce(
		(total, section) => total + section.questionIds.length,
		0
	)
	const questionSectionTitles = sections.reduce<Record<string, string>>(
		(result, section) => {
			section.questionIds.forEach(questionId => {
				result[questionId] = section.title || `Раздел ${section.code}`
			})
			return result
		},
		{}
	)

	const handleSectionChange = (updatedSection: AssessmentSection) => {
		setSections(previous =>
			previous.map(section =>
				section.id === updatedSection.id
					? updatedSection
					: {
							...section,
							questionIds: section.questionIds.filter(
								questionId => !updatedSection.questionIds.includes(questionId)
							)
						}
			)
		)
	}

	const handleAddSection = () => {
		setSections(previous => {
			const nextNumber =
				previous.reduce(
					(maximum, section) => Math.max(maximum, Number(section.code) || 0),
					0
				) + 1

			return [...previous, createSection(nextNumber)]
		})
	}

	const handleMoveSection = (index: number, direction: -1 | 1) => {
		setSections(previous => {
			const targetIndex = index + direction
			if (targetIndex < 0 || targetIndex >= previous.length) return previous

			const next = [...previous]
			const [section] = next.splice(index, 1)
			next.splice(targetIndex, 0, section)
			return next
		})
	}

	const handleRemoveSection = (sectionId: string) => {
		setSections(previous =>
			previous.length === 1
				? previous
				: previous.filter(section => section.id !== sectionId)
		)
	}

	const handleSubmit = async () => {
		if (!form.code.trim()) {
			enqueueSnackbar('Укажите код теста.', { variant: 'warning' })
			return
		}

		if (!form.title.trim()) {
			enqueueSnackbar('Укажите название теста.', { variant: 'warning' })
			return
		}

		if (sections.some(section => !section.title.trim())) {
			enqueueSnackbar('Укажите название каждого раздела.', {
				variant: 'warning'
			})
			return
		}

		if (sections.some(section => section.questionIds.length === 0)) {
			enqueueSnackbar('Добавьте хотя бы один вопрос в каждый раздел.', {
				variant: 'warning'
			})
			return
		}

		if (
			sections.some(
				section =>
					section.selectionType === 'num_generate' &&
					(section.selectionNum < 1 ||
						section.selectionNum > section.questionIds.length)
			)
		) {
			enqueueSnackbar(
				'Проверьте число случайно выбираемых вопросов в разделах.',
				{
					variant: 'warning'
				}
			)
			return
		}

		try {
			const result = await createAssessment({
				...form,
				sections: sections.map(section => ({
					code: section.code,
					title: section.title,
					duration: section.duration,
					passingScore: section.passingScore,
					order: section.order,
					selectionType: section.selectionType,
					selectionNum: section.selectionNum,
					questionIds: section.questionIds
				}))
			})
			enqueueSnackbar(
				`Тест создан и опубликован: ${result.questionCount} вопросов.`,
				{ variant: 'success' }
			)
			setForm(initialForm)
			setSections(createInitialSections())
		} catch (error) {
			enqueueSnackbar(
				getApiErrorMessage(error) ||
					'Не удалось создать тест. Повторите попытку.',
				{ variant: 'error' }
			)
		}
	}

	return (
		<div className={styles.container}>
			<Typography variant='h4' gutterBottom align='center'>
				Создание теста
			</Typography>

			<Paper className={styles.settings}>
				<Stack spacing={2}>
					<Typography variant='h6'>Основные настройки</Typography>

					<div className={styles.formGrid}>
						<TextField
							label='Код теста'
							value={form.code}
							onChange={event =>
								setForm(previous => ({
									...previous,
									code: normalizeAssessmentCode(event.target.value)
								}))
							}
							helperText='Только английские буквы и цифры, без пробелов'
							inputProps={{ inputMode: 'text', pattern: '[A-Za-z0-9\\-_]*' }}
							required
							fullWidth
						/>

						<TextField
							label='Название теста'
							value={form.title}
							onChange={event =>
								setForm(previous => ({
									...previous,
									title: event.target.value
								}))
							}
							required
							fullWidth
						/>

						<TextField
							label='Продолжительность, минут'
							type='number'
							value={form.duration}
							onChange={event =>
								setForm(previous => ({
									...previous,
									duration: Number(event.target.value)
								}))
							}
							helperText='От 1 до 1440 минут'
							fullWidth
						/>

						<TextField
							label='Срок назначения, дней'
							type='number'
							value={form.durationDays}
							onChange={event =>
								setForm(previous => ({
									...previous,
									durationDays: Number(event.target.value)
								}))
							}
							helperText='0 — без ограничения срока'
							fullWidth
						/>

						<TextField
							label='Количество попыток'
							type='number'
							value={form.attemptsNum}
							onChange={event =>
								setForm(previous => ({
									...previous,
									attemptsNum: Number(event.target.value)
								}))
							}
							fullWidth
						/>

						<TextField
							label='Проходной балл'
							type='number'
							value={form.passingScore}
							onChange={event =>
								setForm(previous => ({
									...previous,
									passingScore: Number(event.target.value)
								}))
							}
							helperText='0 — без минимального порога'
							fullWidth
						/>

						<TextField
							label='Максимальный балл'
							type='number'
							value={form.maxScore}
							onChange={event =>
								setForm(previous => ({
									...previous,
									maxScore: Number(event.target.value)
								}))
							}
							inputProps={{ min: 0, step: 0.1 }}
							fullWidth
						/>
					</div>
				</Stack>
			</Paper>

			<Accordion sx={{ mt: 2 }}>
				<AccordionSummary expandIcon={<MdExpandMore />}>
					<Typography>Отображение</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Stack spacing={1}>
						<FormControl sx={{ maxWidth: 360 }}>
							<InputLabel id='assessment-player-label'>
								Тип QTI-плеера
							</InputLabel>
							<Select
								labelId='assessment-player-label'
								label='Тип QTI-плеера'
								value={form.playerType}
								onChange={event =>
									setForm(previous => ({
										...previous,
										playerType: event.target
											.value as CreateAssessmentForm['playerType']
									}))
								}
							>
								<MenuItem value='v3'>Версия 3</MenuItem>
								<MenuItem value='v4'>Версия 4</MenuItem>
							</Select>
						</FormControl>
						<FormControlLabel
							control={
								<Switch
									checked={form.isOpen}
									onChange={event =>
										setForm(previous => ({
											...previous,
											isOpen: event.target.checked
										}))
									}
								/>
							}
							label='Открытый тест (возможно самостоятельно назначить тест)'
						/>
						<FormControlLabel
							control={
								<Switch
									checked={form.displayResultReport}
									onChange={event =>
										setForm(previous => ({
											...previous,
											displayResultReport: event.target.checked
										}))
									}
								/>
							}
							label='Показывать отчет о результатах теста'
						/>
						<FormControlLabel
							control={
								<Switch
									checked={form.displayResult}
									onChange={event =>
										setForm(previous => ({
											...previous,
											displayResult: event.target.checked
										}))
									}
								/>
							}
							label='Показывать результаты теста (резюме по тесту)'
						/>
						<FormControlLabel
							control={
								<Switch
									checked={form.showFeedback}
									onChange={event =>
										setForm(previous => ({
											...previous,
											showFeedback: event.target.checked
										}))
									}
								/>
							}
							label='Показывать обратную связь после ответа'
						/>
						<FormControlLabel
							control={
								<Switch
									checked={form.showUnfinishedScore}
									onChange={event =>
										setForm(previous => ({
											...previous,
											showUnfinishedScore: event.target.checked
										}))
									}
								/>
							}
							label='Показывать балл до завершения теста'
						/>
					</Stack>
				</AccordionDetails>
			</Accordion>

			<Paper className={styles.sections}>
				<Box className={styles.sectionsHeader}>
					<Box>
						<Typography variant='h6'>Разделы теста</Typography>
						<Typography color='text.secondary' variant='body2'>
							Вопросы доступны только из загрузок за последние 24 часа. Вопрос
							можно переносить между разделами.
						</Typography>
						<Typography color='text.secondary' variant='body2'>
							Всего назначено вопросов: {selectedQuestionsCount}
						</Typography>
					</Box>
					<Button
						variant='outlined'
						startIcon={<MdAdd />}
						onClick={handleAddSection}
					>
						Добавить раздел
					</Button>
				</Box>

				<Alert severity='info' sx={{ mb: 2 }}>
					После создания тест будет автоматически опубликован.
				</Alert>

				{isQuestionsError ? (
					<Alert severity='error'>
						{getApiErrorMessage(questionsError) ||
							'Не удалось получить список вопросов.'}
					</Alert>
				) : (
					sections.map((section, index) => (
						<AssessmentSectionCard
							key={section.id}
							section={section}
							index={index}
							sectionsCount={sections.length}
							questions={questions}
							questionSectionTitles={questionSectionTitles}
							onChange={handleSectionChange}
							onMoveUp={() => handleMoveSection(index, -1)}
							onMoveDown={() => handleMoveSection(index, 1)}
							onRemove={() => handleRemoveSection(section.id)}
						/>
					))
				)}
			</Paper>

			<Box sx={{ display: 'flex', mt: 2 }}>
				<Button
					variant='contained'
					onClick={handleSubmit}
					disabled={isCreating || isQuestionsLoading}
					sx={{ ml: 'auto', fontSize: '14px' }}
				>
					Создать и опубликовать тест
				</Button>
			</Box>

			{(isQuestionsLoading || isCreating) && <Preloader />}
		</div>
	)
}
