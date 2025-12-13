import { useState } from 'react'

import { assignAdaptationColumnMap } from '@/features/adaptation/assign/model/excelMapping'
import { useAssignAdaptation } from '@/features/adaptation/assign/model/useAssignAdaptation'

import { ExcelFlow } from '@/shared/ui/excelFlow'

import { AssignAdaptationErrors } from './AssignAdaptationErrors'
import { DateControl } from './DateControl'
import styles from './assignAdaptation.module.scss'

export const AssignAdaptationWidget = () => {
	const [isFuture, setIsFuture] = useState(false)

	const {
		excelObj,
		startDateAdapt,
		data,
		isLoading,
		onExcelParsed,
		clearExcel,
		setStartDateValue,
		submit
	} = useAssignAdaptation()

	const submitDisabled = isLoading || !startDateAdapt || isFuture

	return (
		<ExcelFlow
			columnMap={assignAdaptationColumnMap}
			excelData={excelObj}
			excelLength={excelObj.length}
			isLoading={isLoading}
			result={data}
			onExcelParsed={onExcelParsed}
			onClear={clearExcel}
			onSubmit={submit}
			texts={{
				title: 'Назначение адаптации',
				previewTitle: '',
				clearButton: 'Очистить таблицу',
				submitButton: 'Назначить адаптацию',
				successToast: 'Все записи успешно обработаны!',
				errorToast: 'Произошла ошибка, попробуйте позже',
				warningToast: ({ processed, total }) =>
					`Обработано ${processed} из ${total} записей. Есть ошибки.`
			}}
			classes={{
				container: styles.container,
				tableTitle: styles.tableTitle,
				errorsBlock: styles.errorsBlock
			}}
			controlsSlot={
				<DateControl
					value={startDateAdapt}
					onChange={setStartDateValue}
					onInvalidFuture={setIsFuture}
				/>
			}
			submitDisabled={submitDisabled}
			renderErrors={() => <AssignAdaptationErrors data={data} />}
		/>
	)
}
