import { type ReactElement, memo, useMemo } from 'react'
import Select, { type StylesConfig } from 'react-select'

import { Box, Button, Typography } from '@mui/material'
import { enqueueSnackbar } from 'notistack'

import { ExcelPreviewTable } from '@/components/excelPreviewTable/ExcelPreviewTable'
import { ExcelUploader } from '@/components/excelUploader/ExcelUploader'
import { GoBack } from '@/components/goBack/GoBack'
import { Preloader } from '@/components/preloader/Preloader'
import { UniversalSelect } from '@/components/universalSelect/UniversalSelect'

import { useAssignCourseMutation } from '@/store/api/tutorApi'
import {
	cleanExcelObj,
	setExcelData,
	setFilters,
	setTimeAssign
} from '@/store/slices/tutorSlice'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'

import type { IInitialState } from '@/models/filtersModel'

import type { ExcelRow } from '@/lib/excelParser'

import styles from './TrainingManagement.module.scss'

export const TrainingManagement = memo((): ReactElement => {
	type Option = { value: string; label: string }
	type OptionType = {
		value: string
		label: string
	}

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
			{ value: 'getAssessments', label: 'Назначить тест' }
			// { value: 'getGroups', label: 'Добавить в группу' }
		],
		[]
	)

	const handleExcelData = (data: ExcelRow[]) => {
		dispatch(setExcelData(data))
	}

	const uploadToServer = async (countFilter: IInitialState) => {
		try {
			const { notFoundPersons, dublicatePersons, counterPersons, prevAssign } =
				await assign(countFilter).unwrap()

			const hasErrors =
				notFoundPersons.length > 0 ||
				dublicatePersons.length > 0 ||
				prevAssign?.length > 0
			const allSuccess =
				notFoundPersons.length === 0 &&
				dublicatePersons.length === 0 &&
				prevAssign?.length === 0

			if (hasErrors) {
				enqueueSnackbar(
					`Обработано ${counterPersons} из ${excelLength} записей. Есть ошибки.`,
					{
						variant: 'warning',
						style: {
							fontSize: '14px'
						}
					}
				)
			}

			if (allSuccess) {
				enqueueSnackbar('Все записи успешно обработаны!', {
					variant: 'success',
					style: {
						fontSize: '14px'
					}
				})
			}
		} catch (error) {
			enqueueSnackbar('Произошла ошибка, попробуйте позже', {
				variant: 'error',
				style: {
					fontSize: '14px'
				}
			})
			console.error('Ошибка при загрузке на сервер:', error)
		}
	}

	const customStyles: StylesConfig<OptionType> = {
		control: provided => ({
			...provided,
			zIndex: 100
		}),
		menu: provided => ({
			...provided,
			zIndex: 100
		})
	}

	return (
		<div className={styles.container}>
			<GoBack />
			<Typography variant='h4' gutterBottom align='center'>
				Назначение курсов и тестов
			</Typography>
			<div className={styles.filters}>
				<Select<OptionType>
					options={optionsForAction}
					placeholder='Выберите действие'
					onChange={option => {
						if (option) {
							dispatch(setFilters(option))
						} else {
							dispatch(setFilters(null))
						}
					}}
					styles={customStyles}
					isClearable
				/>
				{selectedAction && <UniversalSelect method={selectedAction} />}
				{(selectedAction === 'getCourses' ||
					selectedAction === 'getAssessments') && (
					<input
						type='number'
						className={styles.timeInput}
						placeholder='Время назначения в днях'
						onChange={e => dispatch(setTimeAssign(e.target.value))}
					/>
				)}

				{excelData.length === 0 && (
					<ExcelUploader onSuccess={handleExcelData} />
				)}

				{!!excelData.length && (
					<Button
						variant='contained'
						component='span'
						sx={{ fontSize: '14px' }}
						onClick={() => dispatch(cleanExcelObj())}
					>
						Очистить таблицу
					</Button>
				)}
			</div>

			{excelData.length !== 0 && (
				<div className={styles.tableTitle}>Превью данных файла:</div>
			)}
			<ExcelPreviewTable data={excelData} />

			{shouldShowButton && (
				<Box sx={{ display: 'flex' }}>
					<Button
						variant='contained'
						component='span'
						onClick={() => uploadToServer(countFilter)}
						sx={{ mt: 2, mb: 2, ml: 'auto', fontSize: '14px' }}
						disabled={isLoading}
					>
						Назначить
					</Button>
				</Box>
			)}

			{isLoading && <Preloader />}

			<div className={styles.errorsBlock}>
				{!!data?.dublicatePersons.length && (
					<div>
						Дубликаты в системе:
						<ExcelPreviewTable data={data.dublicatePersons} />
					</div>
				)}
				{!!data?.notFoundPersons.length && (
					<div>
						Не найденные сотрудники:{' '}
						{data.notFoundPersons.map(p => p.fullname).join(', ')}
					</div>
				)}
				{!!data?.prevAssign?.length && (
					<div>
						Были назначены ранее:{' '}
						{data.prevAssign.map(p => p.fullname).join(', ')}
					</div>
				)}
			</div>
		</div>
	)
})
