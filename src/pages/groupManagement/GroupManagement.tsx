import { useMemo } from 'react'
import Select from 'react-select'

import { Typography } from '@mui/material'

import { EditGroupTable } from '@/components/editGroupTable/EeditGroupTable'
import { GoBack } from '@/components/goBack/GoBack'

import {
	useGetGroupListQuery,
	useGetPersonsGroupMutation
} from '@/store/api/groupManagmentApi'
import { setAction, setCurrentGroup } from '@/store/slices/groupManagementSlice'

import { useAppDispatch } from '@/hooks/redux'

import styles from './groupManagement.module.scss'

export const GroupManagement = () => {
	type Option = { value: string; label: string }
	type OptionType = {
		value: string
		label: string
	}

	const dispatch = useAppDispatch()

	const { data, isLoading } = useGetGroupListQuery()

	const [getPersons, { data: personsList, isLoading: personsListLoading }] =
		useGetPersonsGroupMutation()

	const optionsForAction: Option[] = useMemo(
		() => [
			{ value: 'editGroup', label: 'Редактировать группу' },
			{ value: 'addToGroup', label: 'Добавить пользователей' }
		],
		[]
	)

	return (
		<div className={styles.container}>
			<GoBack />
			<Typography variant='h4' gutterBottom align='center'>
				Управление группами
			</Typography>
			<div className={styles.filters}>
				<Select<OptionType>
					options={optionsForAction}
					placeholder='Выберите действие'
					onChange={option => {
						if (option) {
							dispatch(setAction(option))
						} else {
							dispatch(setAction(null))
						}
					}}
					isClearable
				/>

				<Select
					options={data}
					getOptionLabel={e => e.name}
					getOptionValue={e => e.id}
					onChange={async option => {
						if (option) {
							try {
								await getPersons(option).unwrap()
								dispatch(setCurrentGroup(option))
							} catch (error) {
								console.error('Ошибка при отправке группы:', error)
							}
						} else {
							dispatch(setCurrentGroup(null))
						}
					}}
					placeholder={'Выберите группу'}
					isLoading={isLoading}
					isClearable
					isDisabled={isLoading || personsListLoading}
				/>
			</div>

			{!!personsList?.length && <EditGroupTable personsList={personsList} />}
		</div>
	)
}
