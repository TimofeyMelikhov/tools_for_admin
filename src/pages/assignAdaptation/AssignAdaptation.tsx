import { useState } from 'react'

import { Box, Button, Typography } from '@mui/material'
import { enqueueSnackbar } from 'notistack'
import { CustomProvider, DatePicker } from 'rsuite'
import 'rsuite/DateRangePicker/styles/index.css'
import ru from 'rsuite/locales/ru_RU'

import { ExcelPreviewTable } from '@/components/excelPreviewTable/ExcelPreviewTable'
import { ExcelUploader } from '@/components/excelUploader/ExcelUploader'
import { Preloader } from '@/components/preloader/Preloader'

import { useAssignAdaptationMutation } from '@/store/api/assignAdaptationApi'
import {
	cleanExcelObj,
	setExcelData,
	setStartDate
} from '@/store/slices/assignAdaptationSlice'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'

import { formatDate } from '@/lib/dateFormatter'
import type { ExcelRow } from '@/lib/excelParser'

import styles from './assignAdaptation.module.scss'

export const AssignAdaptation = () => {
	const [isFuturedDate, setIsFuturedDate] = useState<boolean>(false)

	const dispatch = useAppDispatch()

	const excelData = useAppSelector(
		state => state.assignAdaptationSlice.excelObj
	)

	const startDateAdapt = useAppSelector(
		state => state.assignAdaptationSlice.startDateAdapt
	)

	const [assignAdaptationHandler, { data, isLoading }] =
		useAssignAdaptationMutation()

	const uploadToServer = async () => {
		const data = {
			excelObj: excelData,
			startDate: startDateAdapt
		}

		try {
			const {
				notFoundPersons,
				dublicatePersons,
				countCreateAdapt,
				haveAProgramm,
				notFoundProgramm,
				haventPosDate
			} = await assignAdaptationHandler(data).unwrap()

			const hasErrors =
				notFoundPersons.length > 0 ||
				dublicatePersons.length > 0 ||
				haveAProgramm.length > 0 ||
				notFoundProgramm.length > 0 ||
				haventPosDate.length > 0
			const allSuccess =
				notFoundPersons.length === 0 &&
				dublicatePersons.length === 0 &&
				haveAProgramm.length === 0 &&
				notFoundProgramm.length === 0 &&
				haventPosDate.length === 0

			if (hasErrors) {
				enqueueSnackbar(
					`Обработано ${countCreateAdapt} из ${excelData.length} записей. Есть ошибки.`,
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

	const handleExcelData = (data: ExcelRow[]) => {
		dispatch(setExcelData(data))
	}

	const changeDateHandler = (date: Date | null) => {
		if (date === null) {
			setIsFuturedDate(false)
			dispatch(setStartDate(null))
			return
		}

		const today = new Date()
		today.setHours(0, 0, 0, 0)
		const inputDate = new Date(date)
		inputDate.setHours(0, 0, 0, 0)

		if (inputDate > today) {
			setIsFuturedDate(true)
			enqueueSnackbar(`Дата старта адаптации не может быть будущим днем!`, {
				variant: 'error',
				style: {
					fontSize: '14px'
				}
			})
		} else {
			setIsFuturedDate(false)
		}
		dispatch(setStartDate(formatDate(date)))
	}

	return (
		<div className={styles.container}>
			<Typography variant='h4' gutterBottom align='center'>
				Назначение адаптации
			</Typography>
			{excelData.length === 0 && <ExcelUploader onSuccess={handleExcelData} />}

			{excelData.length !== 0 && (
				<div className={styles.tableTitle}>
					<CustomProvider locale={ru}>
						<DatePicker
							placeholder={'Дата начала адаптации'}
							format={'dd.MM.yyyy'}
							value={startDateAdapt ? new Date(startDateAdapt) : null}
							onChange={date => changeDateHandler(date)}
							oneTap
						/>
					</CustomProvider>
					<Button
						variant='text'
						component='span'
						sx={{ fontSize: '12px' }}
						onClick={() => dispatch(cleanExcelObj())}
					>
						Очистить таблицу
					</Button>
				</div>
			)}
			<ExcelPreviewTable data={excelData} />

			{!!excelData.length && (
				<Box sx={{ display: 'flex' }}>
					<Button
						variant='contained'
						component='span'
						onClick={() => uploadToServer()}
						sx={{ mt: 2, mb: 2, ml: 'auto', fontSize: '14px' }}
						disabled={isLoading || !startDateAdapt || isFuturedDate}
					>
						Назначить адаптацию
					</Button>
				</Box>
			)}

			{isLoading && <Preloader />}
			{!!data?.dublicatePersons.length && (
				<div className={styles.errorsBlock}>
					Дубликаты в системе:
					<ExcelPreviewTable data={data.dublicatePersons} />
				</div>
			)}
			{!!data?.notFoundPersons.length && (
				<div className={styles.errorsBlock}>
					Не найденные сотрудники:{' '}
					{data.notFoundPersons.map(p => p.fullname).join(', ')}
				</div>
			)}
			{!!data?.notFoundProgramm.length && (
				<div className={styles.errorsBlock}>
					Не найдены программы для следующих сотрудников:{' '}
					{data.notFoundProgramm.map(p => p).join(', ')}
				</div>
			)}
			{!!data?.haveAProgramm.length && (
				<div className={styles.errorsBlock}>
					Уже назначены программы для следующих сотрудников:{' '}
					{data.haveAProgramm.map(p => p).join(', ')}
				</div>
			)}
			{!!data?.haventPosDate.length && (
				<div className={styles.errorsBlock}>
					У сотрудников отсутствуют поля "Дата найма' И/ИЛИ 'Дата встпуления в
					должность": {data.haveAProgramm.map(p => p).join(', ')}
				</div>
			)}
		</div>
	)
}
