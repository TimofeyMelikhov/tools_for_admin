import styles from './rewardsUpdate.module.scss'
import { rewardsUpdateColumnMap } from '@/features/mentors/rewardsUpdate/model/excelMapping'
import { useRewardsUpdate } from '@/features/mentors/rewardsUpdate/model/useRewardsUpdate'
import { ExcelFlow } from '@/shared/ui/excelFlow'

export const RewardsUpdateWidget = () => {
	const {
		excelData,
		excelLength,
		isLoading,
		data,
		onExcelParsed,
		clearExcel,
		submit
	} = useRewardsUpdate()

	return (
		<ExcelFlow
			columnMap={rewardsUpdateColumnMap}
			excelData={excelData}
			excelLength={excelLength}
			isLoading={isLoading}
			result={data}
			onExcelParsed={onExcelParsed}
			onClear={clearExcel}
			onSubmit={submit}
			texts={{
				title: 'Обновление наград наставников',
				previewTitle: 'Превью данных файла:',
				clearButton: 'Очистить таблицу',
				submitButton: 'Обновить награды',
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
