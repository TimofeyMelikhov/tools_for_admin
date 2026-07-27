import { Typography } from '@mui/material'
import { enqueueSnackbar } from 'notistack'

import { Preloader } from '@/shared/ui/preloader'

import { ErrorsSection } from './ErrorsSection'
import styles from './ExcelFlow.module.scss'
import type { ExcelFlowProps, ExcelFlowResult } from './ExcelFlow.types'
import { PreviewSection } from './PreviewSection'
import { SubmitSection } from './SubmitSection'
import { UploadSection } from './UploadSection'

export const ExcelFlow = <TRes extends ExcelFlowResult>(
	props: ExcelFlowProps<TRes>
) => {
	const {
		columnMap,
		errorsColumnMap,
		excelData,
		excelLength,
		isLoading,
		result,
		onExcelParsed,
		onClear,
		onSubmit,
		texts,
		classes,
		controlsSlot,
		submitDisabled,
		renderErrors
	} = props

	const hasData = excelData.length > 0

	const handleSubmit = async () => {
		try {
			const res = await onSubmit(excelData)

			const processed = res?.counterPersons ?? 0
			const dup = res?.dublicatePersons?.length ?? 0
			const nf = res?.notFoundPersons?.length ?? 0
			const hasErrors = dup > 0 || nf > 0

			if (hasErrors) {
				const msg =
					texts.warningToast?.({ processed, total: excelLength }) ??
					`Обработано ${processed} из ${excelLength} записей. Есть ошибки.`
				enqueueSnackbar(msg, {
					variant: 'warning',
					style: { fontSize: '14px' }
				})
				return
			}

			enqueueSnackbar(texts.successToast, {
				variant: 'success',
				style: { fontSize: '14px' }
			})
		} catch (e) {
			enqueueSnackbar(texts.errorToast, {
				variant: 'error',
				style: { fontSize: '14px' }
			})
			console.error('ExcelFlow submit error:', e)
		}
	}

	return (
		<div className={`${styles.container} ${classes?.container ?? ''}`.trim()}>
			<Typography variant='h4' gutterBottom align='center'>
				{texts.title}
			</Typography>

			{texts.subtitle ? (
				<Typography
					variant='body2'
					align='center'
					sx={{ color: '#666', mb: 2 }}
				>
					{texts.subtitle}
				</Typography>
			) : null}

			<UploadSection
				isVisible={!hasData}
				columnMap={columnMap}
				onSuccess={onExcelParsed}
			/>

			<PreviewSection
				excelData={excelData}
				isVisibleTitle={hasData}
				previewTitle={texts.previewTitle}
				clearButton={texts.clearButton}
				onClear={onClear}
				classNameTableTitle={classes?.tableTitle}
				controlsSlot={controlsSlot}
				columnMap={columnMap}
			/>

			{!result?.success && (
				<SubmitSection
					isVisible={excelLength > 0}
					isLoading={isLoading || !!submitDisabled}
					buttonText={texts.submitButton}
					onClick={handleSubmit}
				/>
			)}

			{isLoading ? <Preloader /> : null}

			{renderErrors ? (
				renderErrors(result)
			) : (
				<ErrorsSection
					result={result}
					texts={texts}
					className={classes?.errorsBlock}
					columnMap={errorsColumnMap ?? columnMap}
				/>
			)}
		</div>
	)
}
