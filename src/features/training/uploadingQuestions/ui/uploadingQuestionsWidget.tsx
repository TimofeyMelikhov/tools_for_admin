import { currentDate } from '@/shared/lib/dateFormatter'
import { DownloadExcelButton } from '@/shared/ui/downloadExcelButton'
import { ExcelFlow } from '@/shared/ui/excelFlow'
import { ExcelPreviewTable } from '@/shared/ui/excelPreviewTable'

import { uploadingQuestionsColumnMap } from '../model/excelMapping'
import { useUploadingQuestions } from '../model/useUploadingQuestions'

import styles from './uploadingQuestionsWidget.module.scss'

export const UploadingQuestionsWidget = () => {
	const {
		data,
		clearExcel,
		excelData,
		excelLength,
		isLoading,
		onExcelParsed,
		submit
	} = useUploadingQuestions()

	return (
		<div className={styles.container}>
			<ExcelFlow
				columnMap={uploadingQuestionsColumnMap}
				excelData={excelData}
				excelLength={excelLength}
				isLoading={isLoading}
				result={data}
				onExcelParsed={onExcelParsed}
				onClear={clearExcel}
				onSubmit={submit}
				texts={{
					title: 'Загрузка вопросов теста из шаблона excel',
					previewTitle: 'Исходный файл:',
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

			{/* {!!rows.length && (
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
			)} */}
		</div>
	)
}
