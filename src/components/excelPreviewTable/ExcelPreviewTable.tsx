import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable
} from '@tanstack/react-table'
import React from 'react'

import { COLUMN_MAP } from '@/lib/excelParser'

import styles from './ExcelPreviewTable.module.scss'

const REVERSE_COLUMN_MAP: Record<string, string> = Object.fromEntries(
	Object.entries(COLUMN_MAP).map(([rus, eng]) => [eng, rus])
)

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
	return allKeys.map(key => ({
		accessorKey: key as keyof T,
		header: REVERSE_COLUMN_MAP[key] || key,
		cell: info => info.getValue() ?? '-'
	}))
}
