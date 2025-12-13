import React from 'react'

import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable
} from '@tanstack/react-table'

import type { ColumnMap } from '@/shared/lib/excel/types'

import styles from './ExcelPreviewTable.module.scss'

interface ExcelPreviewTableProps<T extends Record<string, any>> {
	data: T[]
	columnMap?: ColumnMap
}

export function ExcelPreviewTable<T extends Record<string, any>>({
	data,
	columnMap
}: ExcelPreviewTableProps<T>) {
	const headerMap = React.useMemo(() => buildHeaderMap(columnMap), [columnMap])

	const columns = React.useMemo<ColumnDef<T>[]>(
		() => generateColumns(data, headerMap),
		[data, headerMap]
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

function buildHeaderMap(columnMap?: ColumnMap): Record<string, string> {
	if (!columnMap) return {}
	const map: Record<string, string> = {}
	for (const [rus, key] of columnMap) {
		// key -> rus
		map[key] = rus
	}
	return map
}

function generateColumns<T extends Record<string, any>>(
	data: T[],
	headerMap: Record<string, string>
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
		header: headerMap[key] || key,
		cell: info => {
			const value = info.getValue()
			return value !== null && value !== undefined && value !== '' ? value : '-'
		}
	}))
}
