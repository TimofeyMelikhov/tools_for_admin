import { useState } from 'react'

import { enqueueSnackbar } from 'notistack'
import { CustomProvider, DatePicker } from 'rsuite'
import ru from 'rsuite/locales/ru_RU'

import { formatDate } from '@/shared/lib/dateFormatter'

import 'rsuite/DateRangePicker/styles/index.css'

type Props = {
	value: string | null
	onChange: (value: string | null) => void
	onInvalidFuture?: (isInvalid: boolean) => void
}

export const DateControl = ({ value, onChange, onInvalidFuture }: Props) => {
	const [, setIsFuture] = useState(false)

	const changeDateHandler = (date: Date | null) => {
		if (!date) {
			setIsFuture(false)
			onInvalidFuture?.(false)
			onChange(null)
			return
		}

		const today = new Date()
		today.setHours(0, 0, 0, 0)

		const inputDate = new Date(date)
		inputDate.setHours(0, 0, 0, 0)

		if (inputDate > today) {
			setIsFuture(true)
			onInvalidFuture?.(true)
			enqueueSnackbar('Дата старта адаптации не может быть будущим днем!', {
				variant: 'error',
				style: { fontSize: '14px' }
			})
			return
		}

		setIsFuture(false)
		onInvalidFuture?.(false)
		onChange(formatDate(date))
	}

	return (
		<CustomProvider locale={ru}>
			<DatePicker
				placeholder='Дата начала адаптации'
				format='dd.MM.yyyy'
				value={value ? new Date(value) : null}
				onChange={changeDateHandler}
				oneTap
			/>
		</CustomProvider>
	)
}
