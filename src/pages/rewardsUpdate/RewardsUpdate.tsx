import { Box, Button, Typography } from '@mui/material'
import { enqueueSnackbar } from 'notistack'

import { ExcelPreviewTable } from '@/components/excelPreviewTable/ExcelPreviewTable'
import { ExcelUploader } from '@/components/excelUploader/ExcelUploader'
import { GoBack } from '@/components/goBack/GoBack'
import { Preloader } from '@/components/preloader/Preloader'

import { useUpdateRewardsMutation } from '@/store/api/employeApi'
import { cleanExcelObj, setExcelData } from '@/store/slices/rewardsUpdateSlice'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'

import type { ExcelRow } from '@/lib/excelParser'

import styles from './rewardsUpdate.module.scss'

export const RewardsUpdate = () => {
	const dispatch = useAppDispatch()

	const [updateRewards, { data, isLoading }] = useUpdateRewardsMutation()

	const excelData = useAppSelector(state => state.rewardsUpdate.excelObj)
	const excelLength = useAppSelector(
		state => state.rewardsUpdate.excelObj.length
	)

	const handleExcelData = (data: ExcelRow[]) => {
		dispatch(setExcelData(data))
	}

	const uploadToServer = async (excelData: ExcelRow[]) => {
		const data = {
			excelObj: excelData
		}

		try {
			const { notFoundPersons, dublicatePersons, counterPersons } =
				await updateRewards(data).unwrap()

			const hasErrors =
				notFoundPersons.length > 0 || dublicatePersons.length > 0
			const allSuccess =
				notFoundPersons.length === 0 && dublicatePersons.length === 0

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

	return (
		<div className={styles.container}>
			<GoBack />
			<Typography variant='h4' gutterBottom align='center'>
				Обновление наград наставников
			</Typography>
			{excelData.length === 0 && <ExcelUploader onSuccess={handleExcelData} />}

			{excelData.length !== 0 && (
				<div className={styles.tableTitle}>
					Превью данных файла:
					<Button
						variant='contained'
						component='span'
						sx={{ fontSize: '14px' }}
						onClick={() => dispatch(cleanExcelObj())}
					>
						Очистить таблицу
					</Button>
				</div>
			)}
			<ExcelPreviewTable data={excelData} />

			{!!excelLength && (
				<Box sx={{ display: 'flex' }}>
					<Button
						variant='contained'
						component='span'
						onClick={() => uploadToServer(excelData)}
						sx={{ mt: 2, mb: 2, ml: 'auto', fontSize: '14px' }}
						disabled={isLoading}
					>
						Обновить награды
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
}
