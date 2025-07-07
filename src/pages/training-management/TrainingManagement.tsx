import { type ReactElement, memo, useEffect, useMemo } from 'react'
import Select from 'react-select'

import { Button, Container, Typography } from '@mui/material'
import { SnackbarProvider } from 'notistack'

import { ExcelPreviewTable } from '@/components/excelPreviewTable/ExcelPreviewTable'
import { ExcelUploader } from '@/components/excelUploader/ExcelUploader'
import { Preloader } from '@/components/preloader/Preloader'
import { UniversalSelect } from '@/components/universalSelect/UniversalSelect'

import styles from './TrainingManagement.module.scss'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import type { IInitialState } from '@/models/filtersModel'
import { setFilters, setTimeAssign } from '@/store/actionSlice'
import { useAssignCourseMutation } from '@/store/tutorApi'

export const TrainingManagement = memo((): ReactElement => {
	type Option = { value: string; label: string }

	const dispatch = useAppDispatch()
	const countFilter = useAppSelector(state => state.filters)
	const selectedAction = useAppSelector(
		state => state.filters.selectedAction?.value
	)

	const [assign, { data, isLoading }] = useAssignCourseMutation()

	const uploadToServer = async (countFilter: IInitialState) => {
		try {
			await assign(countFilter).unwrap()
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		console.log(data)
	}, [data])

	const optionsForAction: Option[] = useMemo(
		() => [
			{ value: 'getCourses', label: 'Назначить курс' },
			{ value: 'getAssessments', label: 'Назначить тест' },
			{ value: 'getGroups', label: 'Добавить в группу' }
		],
		[]
	)

	return (
		<SnackbarProvider maxSnack={2}>
			<Container maxWidth='sm' sx={{ mt: 4 }}>
				<Typography variant='h5' gutterBottom>
					Назначение курсов/тестов, добавление в группу
				</Typography>
				<div className={styles.container}>
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
					{selectedAction && <UniversalSelect method={selectedAction} />}
					<input
						type='text'
						placeholder='Введите время назначения в днях'
						onChange={e => dispatch(setTimeAssign(e.target.value))}
					/>
				</div>
				<ExcelUploader />
				<Button
					variant='contained'
					component='span'
					onClick={() => uploadToServer(countFilter)}
				>
					Назначить
				</Button>

				{isLoading && <Preloader />}
				{data !== undefined && (
					<div>
						Дубликаты в системе:
						<ExcelPreviewTable data={data.dublicatePersons} />
						Найдено и назначено {data.counterPersons} сотрудника. Не найденные
						сотрудники:
						{data.notFoundPersons.map(p => p.person).join(', ')}
					</div>
				)}
			</Container>
		</SnackbarProvider>
	)
})
