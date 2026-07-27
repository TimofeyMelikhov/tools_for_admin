import React, { memo, useId, useState } from 'react'

import { Box, Button, CircularProgress, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'

import { parseExcelFile } from '@/shared/lib/excel'

import type { ExcelUploaderProps } from './ExcelUploader.types'

export const ExcelUploader: React.FC<ExcelUploaderProps> = memo(
	({ onSuccess, columnMap, texts }) => {
		const [loading, setLoading] = useState(false)
		const inputId = useId()
		const { enqueueSnackbar } = useSnackbar()

		const buttonText = texts?.button ?? 'Загрузить Excel'
		const loadingText = texts?.loading ?? 'Обработка файла...'
		const successText = texts?.success ?? 'Файл успешно обработан!'
		const errorText = texts?.error ?? 'Ошибка при обработке файла!'

		const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0]
			if (!file) return

			setLoading(true)
			try {
				const jsonData = await parseExcelFile(file, columnMap)
				enqueueSnackbar(successText, {
					variant: 'success',
					style: { fontSize: '14px' }
				})
				onSuccess(jsonData)
			} catch (error) {
				console.error('Error parsing excel file:', error)
				enqueueSnackbar(errorText, {
					variant: 'error',
					style: { fontSize: '14px' }
				})
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
					id={inputId}
					style={{ display: 'none' }}
					onChange={handleFileUpload}
				/>
				<label htmlFor={inputId}>
					<Button variant='contained' component='span' disabled={loading}>
						{buttonText}
					</Button>
				</label>

				{loading && (
					<Box display='flex' alignItems='center' gap={1}>
						<CircularProgress size={24} />
						<Typography>{loadingText}</Typography>
					</Box>
				)}
			</Box>
		)
	}
)
