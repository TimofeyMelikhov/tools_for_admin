import Select from 'react-select'

import { useAppDispatch } from '@/hooks/redux'
import { setCurrentObj } from '@/store/actionSlice'
import { useGetCurrentListQuery } from '@/store/tutorApi'

interface IUniversalSelectProps {
	method: string
}

export const UniversalSelect = ({ method }: IUniversalSelectProps) => {
	const dispatch = useAppDispatch()

	const { data, isLoading } = useGetCurrentListQuery(method)

	return (
		<div>
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
				isLoading={isLoading}
				isClearable
				isDisabled={isLoading}
			/>
		</div>
	)
}
