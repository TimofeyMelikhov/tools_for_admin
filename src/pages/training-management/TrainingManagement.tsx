import { type ReactElement, memo, useEffect, useMemo } from 'react'
import Select from 'react-select'

import { Container, Typography } from '@mui/material'
import axios from 'axios'
import { SnackbarProvider } from 'notistack'

import { ExcelUploader } from '@/components/ExcelUploader'
import { CourseSelect } from '@/components/customCourseOption/CustomSelect'

import { BACKEND_URL } from '@/config/global'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { setCoursesList, setFilters } from '@/store/actionSlice'

export const TrainingManagement = memo((): ReactElement => {
	type Option = { value: string; label: string }

	const dispatch = useAppDispatch()
	const countFilter = useAppSelector(state => state.filters)
	const selectedAction = useAppSelector(
		state => state.filters.selectedAction?.value
	)
	const coursesList = useAppSelector(state => state.filters.coursesList)

	console.log(selectedAction)

	const getCurrentList = async () => {
		const response = await axios
			.get(`${BACKEND_URL}&method=getCourses`)
			.then(response => response.data)
		dispatch(setCoursesList(response))
	}

	useEffect(() => {
		getCurrentList()
	}, [selectedAction])

	console.log('Selected action:', countFilter)

	const optionsForAction: Option[] = useMemo(
		() => [
			{ value: 'assignTest', label: 'Назначить тест' },
			{ value: 'assignCourse', label: 'Назначить курс' },
			{ value: 'addToGroup', label: 'Добавить в группу' }
		],
		[]
	)

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
					{selectedAction === 'assignCourse' && (
						<CourseSelect coursesList={coursesList} />
					)}
				</div>
				<ExcelUploader />
			</Container>
		</SnackbarProvider>
	)
})
