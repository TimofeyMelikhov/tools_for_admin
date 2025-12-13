import { useMemo } from 'react'

import { Box, Button, Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux'
import type { ExcelRow } from '@/shared/lib/excel/types'
import { ExcelPreviewTable } from '@/shared/ui/excelPreviewTable'
import { ExcelUploader } from '@/shared/ui/excelUploader'
import { Preloader } from '@/shared/ui/preloader'

import { trainingAssignColumnMap } from '../model/excelMapping'
import {
	cleanExcel,
	reset,
	setAction,
	setCurrentObj,
	setExcelData,
	setTimeAssign
} from '../model/trainingAssignSlice'
import type { ActionOption } from '../model/types'
import { useTrainingAssignSubmit } from '../model/useTrainingAssignSubmit'

import { ActionSelect } from './ActionSelect'
import { CurrentItemSelect } from './CurrentItemSelect'
import { TimeInput } from './TimeInput'
import { TrainingAssignErrors } from './TrainingAssignErrors'
import styles from './trainingAssign.module.scss'

export const TrainingAssignWidget = () => {
	const dispatch = useAppDispatch()

	const { submit, data, isLoading } = useTrainingAssignSubmit()

	const { currentObj, excelObj, selectedAction, time } = useAppSelector(
		state => state.trainingAssign
	)

	const optionsForAction: ActionOption[] = useMemo(
		() => [
			{ value: 'getCourses', label: 'Назначить курс' },
			{ value: 'getAssessments', label: 'Назначить тест' }
		],
		[]
	)

	const shouldShowButton =
		excelObj.length > 0 && selectedAction !== null && currentObj !== null

	const handleExcelData = (rows: ExcelRow[]) => {
		dispatch(setExcelData(rows))
	}

	const uploadToServer = () =>
		submit({ currentObj, excelObj, selectedAction, time }, () =>
			dispatch(reset())
		)

	return (
		<div className={styles.container}>
			<Typography variant='h4' gutterBottom align='center'>
				Назначение курсов и тестов
			</Typography>

			<div className={styles.filters}>
				<ActionSelect
					options={optionsForAction}
					value={selectedAction}
					onChange={opt => dispatch(setAction(opt))}
				/>

				{selectedAction && (
					<CurrentItemSelect
						method={selectedAction.value}
						value={currentObj}
						onChange={opt => dispatch(setCurrentObj(opt))}
					/>
				)}

				{(selectedAction?.value === 'getCourses' ||
					selectedAction?.value === 'getAssessments') && (
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

			{shouldShowButton && (
				<Box sx={{ display: 'flex' }}>
					<Button
						variant='contained'
						component='span'
						onClick={uploadToServer}
						sx={{ mt: 2, mb: 2, ml: 'auto', fontSize: '14px' }}
						disabled={isLoading}
					>
						Назначить
					</Button>
				</Box>
			)}

			{isLoading && <Preloader />}

			<TrainingAssignErrors data={data} className={styles.errorsBlock} />
		</div>
	)
}
