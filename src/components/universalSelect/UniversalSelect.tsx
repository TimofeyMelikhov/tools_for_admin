import Select from 'react-select'

import { useGetCurrentListQuery } from '@/store/api/tutorApi'
import { setCurrentObj } from '@/store/slices/tutorSlice'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'

import styles from './UniversalSelect.module.scss'

interface IUniversalSelectProps {
	method: string
}

export const UniversalSelect = ({ method }: IUniversalSelectProps) => {
	const dispatch = useAppDispatch()
	const currentObj = useAppSelector(state => state.filters.currentObj)
	const { data, isLoading } = useGetCurrentListQuery(method)

	return (
		<div className={styles.wrapper}>
			<Select
				options={data}
				getOptionLabel={e => e.name}
				getOptionValue={e => e.id}
				onChange={option => {
					if (option) {
						dispatch(setCurrentObj(option))
					} else {
						dispatch(setCurrentObj(null))
					}
				}}
				value={currentObj}
				placeholder={'Выберите элемент'}
				isLoading={isLoading}
				isClearable
				isDisabled={isLoading}
			/>
		</div>
	)
}
