import { components } from 'react-select'
import type { OptionProps, SingleValueProps } from 'react-select'

import styles from './CustomCourseOption.module.scss'
import type { ICoursesList } from '@/models/filtersModel'

// Форматируем дату
const formatDate = (dateStr: string) => {
	const date = new Date(dateStr)
	return date.toLocaleDateString('ru-RU')
}

// Вариант для выпадающего списка
export const CustomOption = (props: OptionProps<ICoursesList, false>) => {
	const { data } = props

	return (
		<components.Option {...props}>
			<div className={styles.option}>
				<div className={styles.topRow}>
					[{data.code}] {data.name}
				</div>
				<div className={styles.bottomRow}>
					Дата последнего изменения: {formatDate(data.modification_date)}
				</div>
			</div>
		</components.Option>
	)
}

// Вариант для выбранного элемента
export const CustomSingleValue = (
	props: SingleValueProps<ICoursesList, false>
) => {
	const { data } = props
	return (
		<components.SingleValue {...props}>
			[{data.code}] {data.name}
		</components.SingleValue>
	)
}
