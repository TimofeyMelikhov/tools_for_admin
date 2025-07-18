import { type ReactElement, memo, useMemo } from 'react'
import Select from 'react-select'

import { Box, Button, TextField, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'

import { ExcelPreviewTable } from '@/components/excelPreviewTable/ExcelPreviewTable'
import { ExcelUploader } from '@/components/excelUploader/ExcelUploader'
import { Preloader } from '@/components/preloader/Preloader'
import { UniversalSelect } from '@/components/universalSelect/UniversalSelect'

import { useAssignCourseMutation } from '@/store/api/tutorApi'
import {
	cleanExcelObj,
	setExcelData,
	setFilters,
	setTimeAssign
} from '@/store/slices/actionSlice'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'

import type { IInitialState } from '@/models/filtersModel'

import type { ExcelRow } from '@/lib/excelParser'

import styles from './TrainingManagement.module.scss'

export const TrainingManagement = memo((): ReactElement => {
	type Option = { value: string; label: string }

	const { enqueueSnackbar } = useSnackbar()
	const dispatch = useAppDispatch()
	const [assign, { data, isLoading }] = useAssignCourseMutation()

	const countFilter = useAppSelector(state => state.filters)
	const excelLength = useAppSelector(state => state.filters.excelObj.length)
	const excelData = useAppSelector(state => state.filters.excelObj)
	const selectedAction = useAppSelector(
		state => state.filters.selectedAction?.value
	)

	const shouldShowButton =
		countFilter.excelObj.length !== 0 &&
		selectedAction !== null &&
		countFilter.currentObj !== null
	const optionsForAction: Option[] = useMemo(
		() => [
			{ value: 'getCourses', label: 'Назначить курс' },
			{ value: 'getAssessments', label: 'Назначить тест' },
			{ value: 'getGroups', label: 'Добавить в группу' }
		],
		[]
	)

	const handleExcelData = (data: ExcelRow[]) => {
		dispatch(setExcelData(data))
	}

	const uploadToServer = async (countFilter: IInitialState) => {
		try {
			const { notFoundPersons, dublicatePersons, counterPersons } =
				await assign(countFilter).unwrap()

			const hasErrors =
				notFoundPersons.length > 0 || dublicatePersons.length > 0
			const allSuccess =
				notFoundPersons.length === 0 && dublicatePersons.length === 0

			if (hasErrors) {
				enqueueSnackbar(
					`Обработано ${counterPersons} из ${excelLength} записей. Есть ошибки.`,
					{ variant: 'warning' }
				)
			}

			if (allSuccess) {
				enqueueSnackbar('Все записи успешно обработаны!', {
					variant: 'success'
				})
			}
		} catch (error) {
			enqueueSnackbar('Произошла ошибка, попробуйте позже', {
				variant: 'error'
			})
			console.error('Ошибка при загрузке на сервер:', error)
		}
	}

	return (
		<div className={styles.container}>
			<Typography variant='h4' gutterBottom align='center'>
				Назначение курсов/тестов, добавление в группу
			</Typography>
			<div className={styles.filters}>
				<Select
					options={optionsForAction}
					placeholder='Выберите действие'
					onChange={option => {
						if (option) {
							dispatch(setFilters(option))
						} else {
							dispatch(setFilters(null))
						}
					}}
					isClearable
				/>
				{selectedAction && <UniversalSelect method={selectedAction} />}
				{(selectedAction === 'getCourses' ||
					selectedAction === 'getAssessments') && (
					<TextField
						label='Введите время назначения в днях'
						variant='outlined'
						size='small'
						onChange={e => dispatch(setTimeAssign(e.target.value))}
					/>
				)}

				<ExcelUploader onSuccess={handleExcelData} />
			</div>

			{excelData.length !== 0 && (
				<div className={styles.tableTitle}>
					Превью данных файла:
					<Button
						variant='contained'
						component='span'
						onClick={() => dispatch(cleanExcelObj())}
					>
						Очистить таблицу
					</Button>
				</div>
			)}
			<ExcelPreviewTable data={excelData} />

			{shouldShowButton && (
				<Box sx={{ display: 'flex' }}>
					<Button
						variant='contained'
						component='span'
						onClick={() => uploadToServer(countFilter)}
						sx={{ mt: 2, mb: 2, ml: 'auto' }}
					>
						Назначить
					</Button>
				</Box>
			)}

			{isLoading && <Preloader />}
			{(!!data?.dublicatePersons.length || !!data?.notFoundPersons.length) && (
				<div className={styles.errorsBlock}>
					Дубликаты в системе:
					<ExcelPreviewTable data={data.dublicatePersons} />
					Не найденные сотрудники:{' '}
					{data.notFoundPersons.map(p => p.fullname).join(', ')}
				</div>
			)}
		</div>
	)
})
