import Select, { type StylesConfig } from 'react-select'

import { useGetCurrentListQuery } from '../api/trainingAssignApi'
import type { UploadListItem } from '../model/types'

type Props = {
	method: string
	value: UploadListItem | null
	onChange: (value: UploadListItem | null) => void
}

export const CurrentItemSelect = ({ method, value, onChange }: Props) => {
	const { data, isLoading } = useGetCurrentListQuery(method)

	const selectStyles: StylesConfig<UploadListItem, false> = {
		container: base => ({
			...base,
			minWidth: '250px'
		}),
		control: base => ({
			...base
		}),
		menu: base => ({
			...base
		})
	}

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
			styles={selectStyles}
		/>
	)
}
