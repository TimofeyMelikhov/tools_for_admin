import React, { useState } from 'react'

import { Box, Button, CircularProgress, Typography } from '@mui/material'
import axios from 'axios'
import { useSnackbar } from 'notistack'

import { parseExcelFile } from '@/utils/excelParser'

interface ExcelRow {
	[key: string]: string | number | boolean | null
}

export const ExcelUploader: React.FC = () => {
	const [loading, setLoading] = useState<boolean>(false)
	const { enqueueSnackbar } = useSnackbar()

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

			// Отправляем данные на сервер
			// const response = await axios.post('/api/upload', jsonData)
			// console.log('Server response:', response.data)

			enqueueSnackbar('Файл успешно обработан и отправлен!', {
				variant: 'success'
			})
		} catch (error) {
			console.error('Error parsing or sending file:', error)
			enqueueSnackbar('Ошибка при обработке файла!', { variant: 'error' })
		} finally {
			setLoading(false)
			e.target.value = ''
		}
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

			{loading && (
				<Box display='flex' alignItems='center' gap={1}>
					<CircularProgress size={24} />
					<Typography>Обработка файла...</Typography>
				</Box>
			)}
		</Box>
	)
}

export default ExcelUploader
