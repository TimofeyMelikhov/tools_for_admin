import { Button } from '@mui/material'
import { MdDownload } from 'react-icons/md'

import { ExcelFlow } from '@/shared/ui/excelFlow'

import { uploadingQuestionsColumnMap } from '../model/excelMapping'
import { useUploadingQuestions } from '../model/useUploadingQuestions'

import styles from './uploadingQuestionsWidget.module.scss'

const templateDownloadUrl = `${import.meta.env.BASE_URL}question-upload-template.xlsx`

const uploadingQuestionsFlowConfig = {
	columnMap: uploadingQuestionsColumnMap,
	texts: {
		title: 'Загрузка вопросов теста из шаблона excel',
		previewTitle: 'Исходный файл:',
		clearButton: 'Очистить таблицу',
		submitButton: 'Загрузить вопросы',
		successToast: 'Все вопросы успешно обработаны!',
		errorToast: 'Произошла ошибка'
	},
	classes: {
		container: styles.container,
		tableTitle: styles.tableTitle,
		errorsBlock: styles.errorsBlock
	}
}

export const UploadingQuestionsWidget = () => {
	const {
		data,
		clearExcel,
		excelData,
		excelLength,
		isLoading,
		errorMessage,
		onExcelParsed,
		submit
	} = useUploadingQuestions()

	if (errorMessage) {
		console.error(errorMessage)
	}

	return (
		<div className={styles.container}>
			<ExcelFlow
				{...uploadingQuestionsFlowConfig}
				titleSlot={
					<Button
						component='a'
						download='Шаблон для загрузки вопросов.xlsx'
						href={templateDownloadUrl}
						size='small'
						startIcon={<MdDownload />}
						variant='outlined'
					>
						Скачать шаблон
					</Button>
				}
				excelData={excelData}
				excelLength={excelLength}
				isLoading={isLoading}
				result={data}
				onExcelParsed={onExcelParsed}
				onClear={clearExcel}
				onSubmit={submit}
			/>
		</div>
	)
}
