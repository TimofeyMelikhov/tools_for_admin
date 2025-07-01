import { memo } from 'react'
import Select from 'react-select'

import { CustomOption, CustomSingleValue } from './CustomCourseOption'
import type { ICoursesList } from '@/models/filtersModel'

interface Props {
	coursesList: ICoursesList[]
}

export const CourseSelect = memo(({ coursesList }: Props) => {
	return (
		<Select<ICoursesList, false>
			options={coursesList}
			getOptionLabel={e => e.name}
			getOptionValue={e => e.id}
			placeholder='Выберите курс'
			isClearable
			components={{
				Option: CustomOption,
				SingleValue: CustomSingleValue
			}}
		/>
	)
})
