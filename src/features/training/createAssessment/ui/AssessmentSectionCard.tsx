import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	FormControl,
	IconButton,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	TextField,
	Tooltip,
	Typography
} from '@mui/material'
import {
	MdAdd,
	MdArrowDownward,
	MdArrowUpward,
	MdDeleteOutline,
	MdExpandMore
} from 'react-icons/md'

import type { AssessmentQuestion, AssessmentSection } from '../model/types'

import { AssessmentQuestionsTable } from './AssessmentQuestionsTable'
import styles from './createAssessment.module.scss'

type Props = {
	section: AssessmentSection
	index: number
	sectionsCount: number
	questions: AssessmentQuestion[]
	questionSectionTitles: Record<string, string>
	onChange: (section: AssessmentSection) => void
	onMoveUp: () => void
	onMoveDown: () => void
	onRemove: () => void
}

export const AssessmentSectionCard = ({
	section,
	index,
	sectionsCount,
	questions,
	questionSectionTitles,
	onChange,
	onMoveUp,
	onMoveDown,
	onRemove
}: Props) => {
	const updateSection = (values: Partial<AssessmentSection>) => {
		onChange({ ...section, ...values })
	}

	return (
		<Accordion defaultExpanded={index === 0} className={styles.sectionCard}>
			<AccordionSummary expandIcon={<MdExpandMore />}>
				<Box className={styles.sectionSummary}>
					<Box>
						<Typography fontWeight={600}>
							Раздел {index + 1}: {section.title || 'Без названия'}
						</Typography>
						<Typography color='text.secondary' variant='body2'>
							Вопросов: {section.questionIds.length}
						</Typography>
					</Box>

					<Stack direction='row' spacing={0.5} onClick={event => event.stopPropagation()}>
						<Tooltip title='Переместить выше'>
							<span>
								<IconButton
									onClick={onMoveUp}
									disabled={index === 0}
									size='small'
								>
									<MdArrowUpward />
								</IconButton>
							</span>
						</Tooltip>
						<Tooltip title='Переместить ниже'>
							<span>
								<IconButton
									onClick={onMoveDown}
									disabled={index === sectionsCount - 1}
									size='small'
								>
									<MdArrowDownward />
								</IconButton>
							</span>
						</Tooltip>
						<Tooltip title='Удалить раздел'>
							<span>
								<IconButton
									color='error'
									disabled={sectionsCount === 1}
									onClick={onRemove}
									size='small'
								>
									<MdDeleteOutline />
								</IconButton>
							</span>
						</Tooltip>
					</Stack>
				</Box>
			</AccordionSummary>
			<AccordionDetails>
				<div className={styles.sectionGrid}>
					<TextField
						label='Код раздела'
						value={section.code}
						onChange={event => updateSection({ code: event.target.value })}
						fullWidth
					/>
					<TextField
						label='Название раздела'
						value={section.title}
						onChange={event => updateSection({ title: event.target.value })}
						required
						fullWidth
					/>
					<TextField
						label='Продолжительность, минут'
						type='number'
						value={section.duration}
						onChange={event => updateSection({ duration: Number(event.target.value) })}
						helperText='0 — использовать общее ограничение теста'
						fullWidth
					/>
					<TextField
						label='Проходной балл раздела'
						type='number'
						value={section.passingScore}
						onChange={event => updateSection({ passingScore: Number(event.target.value) })}
						helperText='0 — без отдельного порога'
						fullWidth
					/>
					<FormControl fullWidth>
						<InputLabel id={`section-order-${section.id}`}>Порядок вопросов</InputLabel>
						<Select
							labelId={`section-order-${section.id}`}
							label='Порядок вопросов'
							value={section.order}
							onChange={event =>
								updateSection({
									order: event.target.value as AssessmentSection['order']
								})
							}
						>
							<MenuItem value='Sequential'>По порядку</MenuItem>
							<MenuItem value='Random'>В случайном порядке</MenuItem>
						</Select>
					</FormControl>
					<FormControl fullWidth>
						<InputLabel id={`section-selection-${section.id}`}>Выбор вопросов</InputLabel>
						<Select
							labelId={`section-selection-${section.id}`}
							label='Выбор вопросов'
							value={section.selectionType}
							onChange={event =>
								updateSection({
									selectionType: event.target.value as AssessmentSection['selectionType']
								})
							}
						>
							<MenuItem value='all'>Все вопросы раздела</MenuItem>
							<MenuItem value='num_generate'>Случайно заданное число</MenuItem>
						</Select>
					</FormControl>
					{section.selectionType === 'num_generate' && (
						<TextField
							label='Сколько вопросов выбрать'
							type='number'
							value={section.selectionNum}
							onChange={event =>
								updateSection({ selectionNum: Number(event.target.value) })
							}
							helperText={`Не больше ${section.questionIds.length}`}
							fullWidth
						/>
					)}
				</div>
				<Accordion className={styles.sectionQuestions}>
					<AccordionSummary expandIcon={<MdExpandMore />}>
						<Stack direction='row' spacing={1} alignItems='center'>
							<MdAdd />
							<Typography>Вопросы раздела: {section.questionIds.length}</Typography>
						</Stack>
					</AccordionSummary>
					<AccordionDetails>
						<AssessmentQuestionsTable
							questions={questions}
							selectedQuestionIds={section.questionIds}
							questionSectionTitles={questionSectionTitles}
							onSelectedQuestionIdsChange={questionIds => updateSection({ questionIds })}
						/>
					</AccordionDetails>
				</Accordion>
			</AccordionDetails>
		</Accordion>
	)
}
