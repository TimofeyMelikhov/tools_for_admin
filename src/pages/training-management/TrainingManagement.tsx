import { type ReactElement } from 'react'
import Select from 'react-select'

import { Container, Typography } from '@mui/material'
import { SnackbarProvider } from 'notistack'

import ExcelUploader from '@/components/ExcelUploader'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { setFilters } from '@/store/actionSlice'

export const TrainingManagement = (): ReactElement => {
	type Option = { value: string; label: string }

	const dispatch = useAppDispatch()
	const countFilter = useAppSelector(
		state => state.filters.selectedAction?.value
	)

	console.log('Selected action:', countFilter)

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
				</div>
				<ExcelUploader />
			</Container>
		</SnackbarProvider>
	)
}
