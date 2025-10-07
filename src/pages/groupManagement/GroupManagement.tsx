import { useCallback, useEffect, useMemo } from 'react'
import Select, { type SingleValue } from 'react-select'

import { Box, Button, Typography } from '@mui/material'
import { enqueueSnackbar } from 'notistack'

import { EditGroupTable } from '@/components/editGroupTable/EeditGroupTable'
import { ExcelPreviewTable } from '@/components/excelPreviewTable/ExcelPreviewTable'
import { ExcelUploader } from '@/components/excelUploader/ExcelUploader'
import { Preloader } from '@/components/preloader/Preloader'

import {
	useGetGroupListQuery,
	useLazyGetCollaboratorsQuery,
	useLazyGetPersonsGroupQuery,
	useManageGroupMutation
} from '@/store/api/groupManagmentApi'
import {
	setAction,
	setCurrentGroup,
	setExcelData,
	setSearchString,
	setSelectedUser,
	setTargetGroup,
	setUsersToSelectList
} from '@/store/slices/groupManagementSlice'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { useDebounce } from '@/hooks/useDebounce'

import type { ICollaboratorOption, IUploadList } from '@/models/filtersModel'

import type { ExcelRow } from '@/lib/excelParser'

import styles from './groupManagement.module.scss'
import {
	type OptionType,
	operationConfig,
	optionsForAction
} from './groupManagmentConst'

export const GroupManagement = () => {
	const dispatch = useAppDispatch()

	const groupManagementState = useAppSelector(
		state => state.groupManagementSlice
	)
	const excelData = useAppSelector(state => state.groupManagementSlice.excelObj)
	const {
		selectedUsers,
		selectedAction,
		targetGroup,
		searchString,
		currentGroup,
		selectedUser
	} = useAppSelector(state => state.groupManagementSlice)

	const { data: groups = [] } = useGetGroupListQuery(undefined, {
		refetchOnMountOrArgChange: false
	})

	const [
		fetchPerson,
		{ data: personsList, isLoading: personsListLoading, reset: resetPerson }
	] = useLazyGetPersonsGroupQuery()

	const [manageGroup, { data, isLoading, reset: resetDublicate }] =
		useManageGroupMutation()

	const handleExcelData = useCallback(
		(data: ExcelRow[]) => {
			dispatch(setExcelData(data))
		},
		[dispatch]
	)

	const debouncedSearch = useDebounce(searchString, 500).trim().toLowerCase()

	const [
		triggerSearch,
		{ data: searchResponse, isLoading: loadColl, reset: resetPersonQuery }
	] = useLazyGetCollaboratorsQuery()

	useEffect(() => {
		if (debouncedSearch.length >= 2) {
			triggerSearch({ search: debouncedSearch })
		}
	}, [debouncedSearch, triggerSearch])

	const handleInputChange = useCallback(
		(newValue: string) => {
			dispatch(setSearchString(newValue))
		},
		[dispatch]
	)

	const options = useMemo(
		() =>
			(searchResponse || []).map(employee => ({
				value: employee.id,
				label: `${employee.fullname} (${employee.position_name})`,
				employee
			})),
		[searchResponse]
	)

	const handleChangeUser = useCallback(
		(newValue: SingleValue<ICollaboratorOption>) => {
			if (newValue) {
				dispatch(setSelectedUser(newValue.employee))
			} else {
				dispatch(setSelectedUser(null))
			}
		},
		[dispatch]
	)

	const setCurrentGroupHandler = useCallback(
		async (option: SingleValue<IUploadList>) => {
			resetDublicate()
			if (!option) {
				resetPerson()
				dispatch(setCurrentGroup(null))
				dispatch(setUsersToSelectList([]))
				return
			}

			if (selectedAction?.value !== 'addToGroup') {
				try {
					await fetchPerson(option).unwrap()
				} catch (error) {
					console.error('Ошибка при получении списка сотрудников:', error)
					enqueueSnackbar('Ошибка при загрузке списка сотрудников', {
						variant: 'error',
						style: {
							fontSize: '14px'
						}
					})
				}
			}
			dispatch(setCurrentGroup(option))
		},
		[dispatch, selectedAction?.value, fetchPerson, resetPerson, resetDublicate]
	)

	const setTargetGroupHandler = useCallback(
		async (option: SingleValue<IUploadList>) => {
			resetDublicate()
			if (!option) {
				dispatch(setTargetGroup(null))
				return
			}
			dispatch(setTargetGroup(option))
		},
		[dispatch, resetDublicate]
	)

	const selectActionHandler = useCallback(
		(option: SingleValue<OptionType>) => {
			resetDublicate()
			resetPersonQuery()
			if (!option) {
				dispatch(setTargetGroup(null))
				dispatch(setExcelData([]))
				dispatch(setCurrentGroup(null))
				dispatch(setUsersToSelectList([]))
				resetPerson()
			}
			dispatch(setAction(option))
		},
		[dispatch, resetDublicate, resetPerson]
	)

	const handleGroupOperation = useCallback(async () => {
		if (!currentGroup) {
			enqueueSnackbar('Выберите группу', {
				variant: 'warning',
				style: {
					fontSize: '14px'
				}
			})
			return
		}

		if (selectedAction?.value === 'moveToGroup' && !targetGroup) {
			enqueueSnackbar('Выберите целевую группу для перемещения', {
				variant: 'warning',
				style: {
					fontSize: '14px'
				}
			})
			return
		}

		if (selectedAction?.value === 'moveToGroup' && !selectedUsers.length) {
			enqueueSnackbar('Выберите сотрудников для перемещения', {
				variant: 'warning',
				style: {
					fontSize: '14px'
				}
			})
			return
		}

		if (selectedAction?.value === 'installLeader' && !selectedUser) {
			enqueueSnackbar('Выберите руководителя группы', {
				variant: 'warning',
				style: {
					fontSize: '14px'
				}
			})
			return
		}

		try {
			const operation = selectedAction?.value as keyof typeof operationConfig
			const config = operationConfig[operation]

			if (!config) {
				console.error('Неизвестная операция:', selectedAction?.value)
				return
			}

			const payload = {
				method: config.method,
				data: groupManagementState,
				...(operation === 'moveToGroup' && { targetGroupId: targetGroup?.id })
			}

			const { success, message, code } = await manageGroup(payload).unwrap()

			if (success) {
				await fetchPerson(currentGroup).unwrap()
				dispatch(setUsersToSelectList([]))
				enqueueSnackbar(message, {
					variant: 'success',
					style: { fontSize: '14px' }
				})
			}

			if (code === 101) {
				enqueueSnackbar(message, {
					variant: 'warning',
					style: { fontSize: '14px' }
				})
			}
		} catch (error) {
			enqueueSnackbar('Произошла ошибка, попробуйте позже', {
				variant: 'error',
				style: { fontSize: '14px' }
			})
			console.error('Ошибка при выполнении операции:', error)
		}
	}, [
		currentGroup,
		selectedAction?.value,
		targetGroup,
		selectedUsers.length,
		groupManagementState,
		manageGroup,
		resetPerson,
		dispatch
	])

	// Обработка запроса на сервер
	const getButtonText = useCallback(() => {
		switch (selectedAction?.value) {
			case 'addToGroup':
				return 'Добавить сотрудников'
			case 'deleteFromGroup':
				return 'Удалить сотрудников'
			case 'moveToGroup':
				return 'Переместить сотрудников'
			case 'installLeader':
				return 'Установить руководителя'
			default:
				return 'Выполнить операцию'
		}
	}, [selectedAction?.value])

	const showExcelUploader = useMemo(
		() =>
			selectedAction?.value === 'addToGroup' &&
			!selectedUser &&
			excelData.length === 0,
		[selectedAction?.value, selectedUser, excelData]
	)

	const showUserSelect = useMemo(() => excelData.length === 0, [excelData])

	const showPersonsList = useMemo(
		() =>
			selectedAction?.value === 'deleteFromGroup' ||
			selectedAction?.value === 'moveToGroup' ||
			selectedAction?.value === 'installLeader',
		[selectedAction?.value]
	)

	const filteredGroups = useMemo(
		() => groups?.filter(g => g.id !== currentGroup?.id) || [],
		[groups, currentGroup?.id]
	)

	return (
		<div className={styles.container}>
			<Typography variant='h4' gutterBottom align='center'>
				Управление группами
			</Typography>

			<div className={styles.filters}>
				<Select<OptionType>
					options={optionsForAction}
					placeholder='Выберите действие'
					onChange={selectActionHandler}
					isClearable
				/>

				{selectedAction && (
					<>
						<Select
							options={groups}
							getOptionLabel={e => e.name}
							getOptionValue={e => e.id}
							onChange={setCurrentGroupHandler}
							placeholder={'Выберите группу'}
							isLoading={personsListLoading}
							isClearable
							isDisabled={personsListLoading}
							className={styles.groupSelect}
						/>

						{selectedAction.value === 'moveToGroup' && (
							<Select
								options={filteredGroups}
								getOptionLabel={e => e.name}
								getOptionValue={e => e.id}
								onChange={setTargetGroupHandler}
								placeholder={'Выберите целевую группу'}
								isClearable
								className={styles.groupSelect}
							/>
						)}
						{showUserSelect &&
							(selectedAction.value === 'installLeader' ||
								selectedAction.value === 'addToGroup') && (
								<Select<ICollaboratorOption>
									options={options}
									onInputChange={handleInputChange}
									onChange={handleChangeUser}
									inputValue={searchString}
									isLoading={loadColl}
									isClearable
									isSearchable
									placeholder='Введите ФИО сотрудника...'
									loadingMessage={() => 'Поиск сотрудников...'}
									styles={{
										control: base => ({
											...base,
											minWidth: '260px'
										})
									}}
								/>
							)}
					</>
				)}

				{showExcelUploader && <ExcelUploader onSuccess={handleExcelData} />}

				{!!excelData.length && (
					<Button
						variant='contained'
						component='span'
						sx={{ fontSize: '14px' }}
						onClick={() => {
							resetDublicate()
							dispatch(setExcelData([]))
						}}
					>
						Очистить таблицу
					</Button>
				)}
			</div>

			{!!excelData.length && <ExcelPreviewTable data={excelData} />}

			{showPersonsList && personsList && (
				<EditGroupTable
					personsList={personsList}
					mode={selectedAction?.value === 'installLeader' ? 'view' : 'select'}
				/>
			)}

			{(excelData.length > 0 || showPersonsList || selectedUser) && (
				<Box sx={{ display: 'flex', gap: 2 }}>
					<Button
						variant='contained'
						onClick={handleGroupOperation}
						sx={{ mt: 2, mb: 2, ml: 'auto', fontSize: '14px' }}
						disabled={isLoading}
					>
						{getButtonText()}
					</Button>
				</Box>
			)}

			{(personsListLoading || isLoading) && <Preloader />}

			<div className={styles.errorsBlock}>
				{!!data?.dublicatePersons?.length && (
					<div>
						Дубликаты в системе:
						<ExcelPreviewTable data={data.dublicatePersons} />
					</div>
				)}
				{!!data?.notFoundPersons?.length && (
					<div>
						Не найденные сотрудники:{' '}
						{data.notFoundPersons.map(p => p.fullname).join(', ')}
					</div>
				)}
			</div>
		</div>
	)
}
