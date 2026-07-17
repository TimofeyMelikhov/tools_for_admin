import { useEffect, useState } from 'react'

import { Box, Button, Typography } from '@mui/material'
import { enqueueSnackbar } from 'notistack'

import type { ExcelRow } from '@/shared/lib/excel'
import { ExcelPreviewTable } from '@/shared/ui/excelPreviewTable'
import { ExcelUploader } from '@/shared/ui/excelUploader'
import { Preloader } from '@/shared/ui/preloader'

import { trainingAssignColumnMap } from '../model/excelMapping'
import { useAssignTraining } from '../model/queries'
import type {
	ActionOption,
	Props,
	TrainingAction,
	TrainingAssignState
} from '../model/types'

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

const initialState: TrainingAssignState = {
	selectedAction: null,
	excelObj: [],
	currentObj: null,
	time: ''
}

export const TrainingAssignWidget = ({
	forcedAction,
	title = 'Назначение курсов и тестов',
	submitText = 'Назначить'
}: Props) => {
	const [state, setState] = useState<TrainingAssignState>(initialState)
	const {
		mutateAsync: assignTraining,
		data,
		isPending: isLoading
	} = useAssignTraining()
	const { currentObj, excelObj, selectedAction, time } = state

	useEffect(() => {
		if (!forcedAction) return

		setState({ ...initialState, selectedAction: optionByValue(forcedAction) })
	}, [forcedAction])

	const shouldShowTime =
		selectedAction?.value === 'getCourses' ||
		selectedAction?.value === 'getAssessments'

	const shouldShowSubmit =
		excelObj.length > 0 && selectedAction !== null && currentObj !== null

	const handleExcelData = (rows: ExcelRow[]) => {
		setState(previous => ({ ...previous, excelObj: rows }))
	}

	const uploadToServer = async () => {
		try {
			const res = await assignTraining({
				currentObj,
				excelObj,
				selectedAction,
				time
			})

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
						onChange={opt =>
							setState(previous => ({ ...previous, currentObj: opt }))
						}
					/>
				)}

				{shouldShowTime && (
					<TimeInput
						className={styles.timeInput}
						value={time}
						onChange={v => setState(previous => ({ ...previous, time: v }))}
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
						onClick={() =>
							setState(previous => ({ ...previous, excelObj: [] }))
						}
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
