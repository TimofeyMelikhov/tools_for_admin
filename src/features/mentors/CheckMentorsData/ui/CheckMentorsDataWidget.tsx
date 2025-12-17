import { currentDate } from '@/shared/lib/dateFormatter'
import { DownloadExcelButton } from '@/shared/ui/downloadExcelButton'
import { ExcelFlow } from '@/shared/ui/excelFlow'
import { ExcelPreviewTable } from '@/shared/ui/excelPreviewTable'

import { mentorProfileColumnMap } from '../model/excelMapping'
import { mentorCheckResultColumnMap } from '../model/mentorCheckResultColumnMap'
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
		mergeMentoringRows,
		submit
	} = useMentorsCheckData()

	const rows = data?.rows?.length
		? mergeMentoringRows(excelData, data.rows)
		: []

	return (
		<div className={styles.container}>
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

			{!!rows.length && (
				<div className={styles.resultBlock}>
					<div className={styles.resultTitle}>Результат проверки:</div>
					<ExcelPreviewTable
						data={rows}
						columnMap={mentorCheckResultColumnMap}
					/>
					<div className={styles.excelButton}>
						<DownloadExcelButton
							buttonText='Скачать Excel'
							fileName={`Результат проверки наставников ${currentDate()}`}
							data={rows}
							columnMap={mentorCheckResultColumnMap}
							sheetName='Результат'
							variant='contained'
							size='small'
							disabled={isLoading || rows.length === 0}
						/>
					</div>
				</div>
			)}
		</div>
	)
}
