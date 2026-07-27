import Select, { type StylesConfig } from 'react-select'

import type { UploadListItem } from '../model/types'
import { useCurrentList } from '../model/queries'

type Props = {
	method: string
	value: UploadListItem | null
	onChange: (value: UploadListItem | null) => void
}

export const CurrentItemSelect = ({ method, value, onChange }: Props) => {
	const { data, isLoading } = useCurrentList(method)

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
