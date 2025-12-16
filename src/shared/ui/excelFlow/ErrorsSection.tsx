import type { ColumnMap } from '@/shared/lib/excel'
import { ExcelPreviewTable } from '@/shared/ui/excelPreviewTable/ui/ExcelPreviewTable'

import type { ExcelFlowResult, ExcelFlowTexts } from './ExcelFlow.types'

type Props<TRes extends ExcelFlowResult> = {
	result?: TRes
	texts: ExcelFlowTexts
	className?: string
	columnMap: ColumnMap
}

type TableRow = Record<string, unknown>

function toTableRows(rows: unknown[], columnMap: ColumnMap): TableRow[] {
	const keys = columnMap.map(([, key]) => key)

	return rows.map(row => {
		const out: TableRow = {}

		if (row && typeof row === 'object') {
			const obj = row as Record<string, unknown>
			for (const key of keys) out[key] = obj[key]
			return out
		}

		for (const key of keys) out[key] = row
		return out
	})
}

export const ErrorsSection = <TRes extends ExcelFlowResult>({
	result,
	texts,
	className,
	columnMap
}: Props<TRes>) => {
	const duplicatesRaw = (result?.dublicatePersons ?? []) as unknown[]
	const notFoundRaw = (result?.notFoundPersons ?? []) as unknown[]

	const hasDuplicates = duplicatesRaw.length > 0
	const hasNotFound = notFoundRaw.length > 0

	if (!hasDuplicates && !hasNotFound) return null

	const duplicates = hasDuplicates ? toTableRows(duplicatesRaw, columnMap) : []
	const notFound = hasNotFound ? toTableRows(notFoundRaw, columnMap) : []

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
					{texts.notFoundTitle ?? 'Не найденные сотрудники:'}
					<ExcelPreviewTable data={notFound} columnMap={columnMap} />
				</>
			)}
		</div>
	)
}
