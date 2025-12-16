import type { ColumnMap } from '@/shared/lib/excel'
import { ExcelPreviewTable } from '@/shared/ui/excelPreviewTable/ui/ExcelPreviewTable'

import type { ExcelFlowResult, ExcelFlowTexts } from './ExcelFlow.types'

type Props<TRes extends ExcelFlowResult> = {
	result?: TRes
	texts: ExcelFlowTexts
	className?: string
	columnMap: ColumnMap
}

export const ErrorsSection = <TRes extends ExcelFlowResult>({
	result,
	texts,
	className,
	columnMap
}: Props<TRes>) => {
	const duplicates = result?.dublicatePersons ?? []
	const notFound = result?.notFoundPersons ?? []

	const hasDuplicates = duplicates.length > 0
	const hasNotFound = notFound.length > 0

	if (!hasDuplicates && !hasNotFound) return null

	return (
		<div className={className}>
			{hasDuplicates && (
				<>
					{texts.duplicatesTitle ?? 'Дубликаты в системе:'}
					<ExcelPreviewTable data={duplicates} columnMap={columnMap} />
				</>
			)}

			{hasNotFound && (
				<>
					{texts.notFoundTitle ?? 'Не найденные сотрудники:'}{' '}
					{notFound
						.map(p => p.fullname)
						.filter(Boolean)
						.join(', ')}
				</>
			)}
		</div>
	)
}
