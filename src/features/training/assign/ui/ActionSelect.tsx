import Select, { type StylesConfig } from 'react-select'

import type { ActionOption } from '../model/types'

type Props = {
	value: ActionOption | null
	options: ActionOption[]
	onChange: (value: ActionOption | null) => void
}

const customStyles: StylesConfig<ActionOption> = {
	control: provided => ({ ...provided, zIndex: 100 }),
	menu: provided => ({ ...provided, zIndex: 100 })
}

export const ActionSelect = ({ value, options, onChange }: Props) => {
	return (
		<Select<ActionOption>
			options={options}
			placeholder='Выберите действие'
			onChange={option => onChange(option ?? null)}
			value={value}
			styles={customStyles}
			isClearable
		/>
	)
}
