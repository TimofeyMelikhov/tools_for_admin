import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable
} from '@tanstack/react-table'
import React from 'react'

import { COLUMN_MAP } from '@/lib/excelParser'

import styles from './ExcelPreviewTable.module.scss'

// Создаем обратный маппинг для отображения английских ключей на русские заголовки
const REVERSE_COLUMN_MAP: Record<string, string> = {}
// Берем первое русское название для каждого английского ключа
const usedKeys = new Set()
for (const [rusKey, engKey] of COLUMN_MAP.entries()) {
	if (!usedKeys.has(engKey)) {
		REVERSE_COLUMN_MAP[engKey] = rusKey
		usedKeys.add(engKey)
	}
}

interface ExcelPreviewTableProps<T extends Record<string, any>> {
	data: T[]
}

export function ExcelPreviewTable<T extends Record<string, any>>({
	data
}: ExcelPreviewTableProps<T>) {
	const columns = React.useMemo<ColumnDef<T>[]>(
		() => generateColumns(data),
		[data]
	)

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel()
	})

	if (!data.length) return null

	return (
		<div className={styles.container}>
			<div className={styles.tableWrapper}>
				<table className={styles.table}>
					<thead>
						{table.getHeaderGroups().map(hg => (
							<tr key={hg.id}>
								{hg.headers.map(header => (
									<th key={header.id} className={styles.th}>
										{flexRender(
											header.column.columnDef.header,
											header.getContext()
										)}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody>
						{table.getRowModel().rows.map(row => (
							<tr key={row.id}>
								{row.getVisibleCells().map(cell => (
									<td key={cell.id} className={styles.td}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className={styles.footer}>Всего строк: {data.length}</div>
		</div>
	)
}

function generateColumns<T extends Record<string, any>>(
	data: T[]
): ColumnDef<T>[] {
	if (!data.length) return []

	const allKeys = Object.keys(
		data.reduce((acc, row) => ({ ...acc, ...row }), {})
	)

	const filteredKeys = allKeys.filter(key =>
		data.some(row => {
			const val = row[key]
			return val !== null && val !== undefined && val !== ''
		})
	)

	return filteredKeys.map(key => ({
		accessorKey: key as keyof T,
		header: REVERSE_COLUMN_MAP[key] || key,
		cell: info => {
			const value = info.getValue()
			return value !== null && value !== undefined && value !== '' ? value : '-'
		}
	}))
}
