import { useState, type ReactElement } from 'react'
import Select from 'react-select'

import { Container, Typography } from '@mui/material'
import { SnackbarProvider } from 'notistack'

import ExcelUploader from '@/components/ExcelUploader'

export const MainPage = (): ReactElement => {
	type Option = { value: string; label: string }

	const [actions, setActions] = useState<string>()

	const optionsForAction: Option[] = [
		{ value: 'assignTest', label: 'Назначить тест' },
		{ value: 'assignCourse', label: 'Назначить курс' },
		{ value: 'addToGroup', label: 'Добавить в группу' }
	]

	return (
		<SnackbarProvider maxSnack={2}>
			<Container maxWidth='sm' sx={{ mt: 4 }}>
				<Typography variant='h5' gutterBottom>
					Назначение курсов/тестов, добавление в группу
				</Typography>
				<div>
					<Select
						options={optionsForAction}
						value={}
					/>
				</div>
				<ExcelUploader />
			</Container>
		</SnackbarProvider>
	)
}
