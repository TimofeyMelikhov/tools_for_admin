type Props = {
	value: string
	onChange: (value: string) => void
	disabled?: boolean
	className?: string
}

export const TimeInput = ({ value, onChange, disabled, className }: Props) => {
	return (
		<input
			type='number'
			className={className}
			placeholder='Время назначения в днях'
			onChange={e => onChange(e.target.value)}
			value={value}
			disabled={disabled}
		/>
	)
}
