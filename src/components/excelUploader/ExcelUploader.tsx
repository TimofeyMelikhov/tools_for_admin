import React, { memo, useState } from 'react'

import { Box, Button, CircularProgress, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'

import { ExcelPreviewTable } from '../excelPreviewTable/ExcelPreviewTable'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { type ExcelRow, parseExcelFile } from '@/lib/excelParser'
import { setExcelData } from '@/store/actionSlice'

export const ExcelUploader: React.FC = memo(() => {
	const [loading, setLoading] = useState<boolean>(false)
	const { enqueueSnackbar } = useSnackbar()
	const dispatch = useAppDispatch()
	const excelData = useAppSelector(state => state.filters.excelObj)

	const handleFileUpload = async (
		e: React.ChangeEvent<HTMLInputElement>
	): Promise<void> => {
		const file = e.target.files?.[0]
		if (!file) return

		setLoading(true)
		try {
			const jsonData: ExcelRow[] = await parseExcelFile(file)
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

	return (
		<Box
			display='flex'
			flexDirection='column'
			alignItems='center'
			gap={2}
			sx={{ mt: 2 }}
		>
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
			{excelData.length !== 0 && !loading && (
				<Typography>Превью данных файла</Typography>
			)}

			<ExcelPreviewTable data={excelData} />
		</Box>
	)
})
