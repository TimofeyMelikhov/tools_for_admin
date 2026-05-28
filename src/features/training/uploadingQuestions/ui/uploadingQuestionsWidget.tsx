import { ExcelFlow } from '@/shared/ui/excelFlow'

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
		error,
		onExcelParsed,
		submit
	} = useUploadingQuestions()

	console.log(error)

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
					submitButton: 'Загрузить вопросы',
					successToast: 'Все вопросы успешно обработаны!',
					errorToast: 'Произошла ошибка, попробуйте позже'
				}}
				classes={{
					container: styles.container,
					tableTitle: styles.tableTitle,
					errorsBlock: styles.errorsBlock
				}}
			/>
		</div>
	)
}
