import React from 'react'

import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable
} from '@tanstack/react-table'

import type { ColumnMap } from '@/shared/lib/excel'

import styles from './ExcelPreviewTable.module.scss'

interface ExcelPreviewTableProps<T extends Record<string, any>> {
	data: T[]
	columnMap?: ColumnMap
	hideEmptyMappedColumns?: boolean
}

export function ExcelPreviewTable<T extends Record<string, any>>({
	data,
	columnMap,
	hideEmptyMappedColumns = true
}: ExcelPreviewTableProps<T>) {
	if (!data.length) return null

	const columns = React.useMemo<ColumnDef<T>[]>(() => {
		if (columnMap && columnMap.length) {
			const mappedKeys = columnMap.map(([, key]) => key)

			const visibleKeys = hideEmptyMappedColumns
				? mappedKeys.filter(key =>
						data.some(row => {
							const val = row[key]
							return val !== null && val !== undefined && val !== ''
						})
					)
				: mappedKeys

			return visibleKeys.map(key => {
				const rusHeader = columnMap.find(([, k]) => k === key)?.[0] ?? key

				return {
					accessorKey: key as keyof T,
					header: rusHeader,
					cell: info => formatCellValue(info.getValue())
				}
			})
		}

		const autoKeys = collectKeysFromData(data)

		const nonEmptyKeys = autoKeys.filter(key =>
			data.some(row => {
				const val = row[key]
				return val !== null && val !== undefined && val !== ''
			})
		)

		return nonEmptyKeys.map(key => ({
			accessorKey: key as keyof T,
			header: key,
			cell: info => formatCellValue(info.getValue())
		}))
	}, [columnMap, data, hideEmptyMappedColumns])

	if (!columns.length) return null

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getRowId: (originalRow, index) => {
			const maybeId = (originalRow as Record<string, unknown>).id
			if (typeof maybeId === 'string' || typeof maybeId === 'number') {
				return String(maybeId)
			}
			return String(index)
		}
	})

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

function collectKeysFromData<T extends Record<string, any>>(
	data: T[]
): string[] {
	const keys = new Set<string>()
	for (const row of data) {
		for (const key of Object.keys(row)) {
			keys.add(key)
		}
	}
	return Array.from(keys)
}

function formatCellValue(value: unknown) {
	if (value === null || value === undefined || value === '') return '-'

	if (typeof value === 'boolean') return value ? 'Да' : 'Нет'
	if (typeof value === 'number') return String(value)
	if (typeof value === 'string') return value

	if (Array.isArray(value)) {
		return value
			.map(v => (v === null || v === undefined || v === '' ? '-' : String(v)))
			.join(', ')
	}

	if (typeof value === 'object') {
		try {
			return JSON.stringify(value)
		} catch {
			return String(value)
		}
	}

	return String(value)
}
