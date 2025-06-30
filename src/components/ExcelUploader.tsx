import React, { useState } from 'react'

import { Box, Button, CircularProgress, Typography } from '@mui/material'
import axios from 'axios'
import { useSnackbar } from 'notistack'

import { ExcelPreviewTable } from './excelPreviewTable/ExcelPreviewTable'
import { BACKEND_URL } from '@/config/global'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { parseExcelFile } from '@/lib/excelParser'
import { setExcelData } from '@/store/actionSlice'

interface ExcelRow {
	[key: string]: string | number | boolean | null
}

export const ExcelUploader: React.FC = () => {
	const [loading, setLoading] = useState<boolean>(false)
	const { enqueueSnackbar } = useSnackbar()
	const dispatch = useAppDispatch()
	const excelData = useAppSelector(state => state.filters.excelObj)
	const selectedAction = useAppSelector(
		state => state.filters.selectedAction?.value
	)

	const handleFileUpload = async (
		e: React.ChangeEvent<HTMLInputElement>
	): Promise<void> => {
		const file = e.target.files?.[0]
		if (!file) return

		setLoading(true)
		try {
			// Используем вынесенную функцию
			const jsonData: ExcelRow[] = await parseExcelFile(file)
			console.log('Parsed JSON:', jsonData)

			enqueueSnackbar('Файл успешно обработан!', {
				variant: 'success'
			})
			dispatch(setExcelData(jsonData))
		} catch (error) {
			console.error('Error parsing or sending file:', error)
			enqueueSnackbar('Ошибка при обработке файла!', { variant: 'error' })
		} finally {
			setLoading(false)
			e.target.value = ''
		}
	}

	const uploadToServer = async (excelData: ExcelRow[]) => {
		await axios.post(`${BACKEND_URL}&method=${selectedAction}`, excelData)
	}

	return (
		<Box display='flex' flexDirection='column' alignItems='center' gap={2}>
			<input
				type='file'
				accept='.xlsx, .xls'
				id='excel-input'
				style={{ display: 'none' }}
				onChange={handleFileUpload}
			/>
			<label htmlFor='excel-input'>
				<Button variant='contained' component='span' disabled={loading}>
					Загрузить Excel
				</Button>
			</label>
			<Button
				variant='contained'
				component='span'
				onClick={() => uploadToServer(excelData)}
			>
				Назначить
			</Button>

			{loading && (
				<Box display='flex' alignItems='center' gap={1}>
					<CircularProgress size={24} />
					<Typography>Обработка файла...</Typography>
				</Box>
			)}

			<ExcelPreviewTable data={excelData} />
		</Box>
	)
}

export default ExcelUploader
