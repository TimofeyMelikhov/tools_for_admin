import Select from 'react-select'

import { useGetCurrentListQuery } from '../api/trainingAssignApi'
import type { UploadListItem } from '../model/types'

type Props = {
	method: string
	value: UploadListItem | null
	onChange: (value: UploadListItem | null) => void
}

export const CurrentItemSelect = ({ method, value, onChange }: Props) => {
	const { data, isLoading } = useGetCurrentListQuery(method)

	return (
		<Select
			options={data ?? []}
			getOptionLabel={e => e.name}
			getOptionValue={e => e.id}
			onChange={option => onChange(option ?? null)}
			value={value}
			placeholder='Выберите элемент'
			isLoading={isLoading}
			isClearable
			isDisabled={isLoading}
		/>
	)
}
