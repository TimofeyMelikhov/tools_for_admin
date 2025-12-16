import { ExcelFlow } from '@/shared/ui/excelFlow'

import { mentorProfileColumnMap } from '../model/excelMapping'
import { useMentorsCheckData } from '../model/useMentorsCheckData'

import styles from './checkMentorsData.module.scss'

export const CheckMentorsDataWidget = () => {
	const {
		data,
		clearExcel,
		excelData,
		excelLength,
		isLoading,
		onExcelParsed,
		submit
	} = useMentorsCheckData()

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
				title: 'Проверка данных наставников из Excel файла',
				previewTitle: 'Превью данных файла:',
				clearButton: 'Очистить таблицу',
				submitButton: 'Получить данные',
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
