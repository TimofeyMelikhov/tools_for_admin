import { mentorProfileColumnMap } from '@/features/mentors/MentorProfile/model/excelMapping'
import { useMentorProfileUpdate } from '@/features/mentors/MentorProfile/model/useMentorProfileUpdate'

import { ExcelFlow } from '@/shared/ui/excelFlow'

import styles from './mentorProfile.module.scss'

export const MentorProfileUpdateWidget = () => {
	const {
		excelData,
		excelLength,
		isLoading,
		data,
		onExcelParsed,
		clearExcel,
		submit
	} = useMentorProfileUpdate()

	return (
		<ExcelFlow
			columnMap={mentorProfileColumnMap}
			excelData={excelData}
			excelLength={excelLength}
			isLoading={isLoading}
			result={data}
			onExcelParsed={onExcelParsed}
			onClear={clearExcel}
			onSubmit={submit}
			texts={{
				title: 'Установка дат процедуры отбора',
				previewTitle: 'Превью данных файла:',
				clearButton: 'Очистить таблицу',
				submitButton: 'Установить дату',
				successToast: 'Все записи успешно обработаны!',
				errorToast: 'Произошла ошибка, попробуйте позже'
			}}
			classes={{
				container: styles.container,
				tableTitle: styles.tableTitle,
				errorsBlock: styles.errorsBlock
			}}
		/>
	)
}
