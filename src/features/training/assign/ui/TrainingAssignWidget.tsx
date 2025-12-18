import { useEffect } from 'react'

import { Box, Button, Typography } from '@mui/material'
import { enqueueSnackbar } from 'notistack'

import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux'
import type { ExcelRow } from '@/shared/lib/excel'
import { ExcelPreviewTable } from '@/shared/ui/excelPreviewTable'
import { ExcelUploader } from '@/shared/ui/excelUploader'
import { Preloader } from '@/shared/ui/preloader'

import { useAssignTrainingMutation } from '../api/trainingAssignApi'
import { trainingAssignColumnMap } from '../model/excelMapping'
import {
	cleanExcel,
	reset,
	setAction,
	setCurrentObj,
	setExcelData,
	setTimeAssign
} from '../model/trainingAssignSlice'
import type { ActionOption, Props, TrainingAction } from '../model/types'

import { CurrentItemSelect } from './CurrentItemSelect'
import { TimeInput } from './TimeInput'
import { TrainingAssignErrors } from './TrainingAssignErrors'
import styles from './trainingAssign.module.scss'

const ACTION_OPTIONS: ActionOption[] = [
	{ value: 'getCourses', label: 'Назначить курс' },
	{ value: 'getAssessments', label: 'Назначить тест' }
]

const optionByValue = (value: TrainingAction): ActionOption =>
	ACTION_OPTIONS.find(o => o.value === value) ?? { value, label: value }

export const TrainingAssignWidget = ({
	forcedAction,
	title = 'Назначение курсов и тестов',
	submitText = 'Назначить'
}: Props) => {
	const dispatch = useAppDispatch()
	const [assignTraining, { data, isLoading }] = useAssignTrainingMutation()

	const { currentObj, excelObj, selectedAction, time } = useAppSelector(
		s => s.trainingAssign
	)

	useEffect(() => {
		if (!forcedAction) return

		dispatch(reset())
		dispatch(setAction(optionByValue(forcedAction)))

		return () => {
			dispatch(reset())
		}
	}, [dispatch, forcedAction])

	useEffect(() => {
		if (forcedAction) return
		return () => {
			dispatch(reset())
		}
	}, [dispatch, forcedAction])

	const shouldShowTime =
		selectedAction?.value === 'getCourses' ||
		selectedAction?.value === 'getAssessments'

	const shouldShowSubmit =
		excelObj.length > 0 && selectedAction !== null && currentObj !== null

	const handleExcelData = (rows: ExcelRow[]) => {
		dispatch(setExcelData(rows))
	}

	const uploadToServer = async () => {
		try {
			const res = await assignTraining({
				currentObj,
				excelObj,
				selectedAction,
				time
			}).unwrap()

			const hasErrors =
				(res.notFoundPersons?.length ?? 0) > 0 ||
				(res.dublicatePersons?.length ?? 0) > 0 ||
				(res.prevAssign?.length ?? 0) > 0

			if (hasErrors) {
				enqueueSnackbar(
					`Обработано ${res.counterPersons} из ${excelObj.length} записей. Есть ошибки.`,
					{ variant: 'warning', style: { fontSize: '14px' } }
				)
				return
			}

			enqueueSnackbar('Все записи успешно обработаны!', {
				variant: 'success',
				style: { fontSize: '14px' }
			})
		} catch (error) {
			enqueueSnackbar('Произошла ошибка, попробуйте позже', {
				variant: 'error',
				style: { fontSize: '14px' }
			})
			console.error('Ошибка при загрузке на сервер:', error)
		}
	}

	return (
		<div className={styles.container}>
			<Typography variant='h4' gutterBottom align='center'>
				{title}
			</Typography>

			<div className={styles.filters}>
				{selectedAction && (
					<CurrentItemSelect
						method={selectedAction.value}
						value={currentObj}
						onChange={opt => dispatch(setCurrentObj(opt))}
					/>
				)}

				{shouldShowTime && (
					<TimeInput
						className={styles.timeInput}
						value={time}
						onChange={v => dispatch(setTimeAssign(v))}
					/>
				)}

				{excelObj.length === 0 && (
					<ExcelUploader
						onSuccess={handleExcelData}
						columnMap={trainingAssignColumnMap}
					/>
				)}

				{!!excelObj.length && (
					<Button
						variant='text'
						component='span'
						sx={{ fontSize: '12px' }}
						onClick={() => dispatch(cleanExcel())}
					>
						Очистить таблицу
					</Button>
				)}
			</div>

			{!!excelObj.length && (
				<div className={styles.tableTitle}>Превью данных файла:</div>
			)}

			<ExcelPreviewTable data={excelObj} columnMap={trainingAssignColumnMap} />

			{shouldShowSubmit && (
				<Box sx={{ display: 'flex' }}>
					<Button
						variant='contained'
						component='span'
						onClick={uploadToServer}
						sx={{ mt: 2, mb: 2, ml: 'auto', fontSize: '14px' }}
						disabled={isLoading}
					>
						{submitText}
					</Button>
				</Box>
			)}

			{isLoading && <Preloader />}

			<TrainingAssignErrors data={data} className={styles.errorsBlock} />
		</div>
	)
}
