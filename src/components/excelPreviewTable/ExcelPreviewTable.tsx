import {
	flexRender,
	getCoreRowModel,
	useReactTable
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import React from 'react'

import styles from './ExcelPreviewTable.module.scss'
import type { ExcelRow } from '@/lib/excelParser'

interface ExcelPreviewTableProps {
	data: ExcelRow[]
}

export const ExcelPreviewTable: React.FC<ExcelPreviewTableProps> = ({
	data
}) => {
	const columns: ColumnDef<ExcelRow>[] = React.useMemo(
		() => [
			{
				header: 'Сотрудник',
				accessorKey: 'person',
				cell: i => i.getValue() ?? '-'
			},
			{
				header: 'Должность',
				accessorKey: 'position',
				cell: i => i.getValue() ?? '-'
			},
			{
				header: 'Отдел',
				accessorKey: 'subdivision',
				cell: i => i.getValue() ?? '-'
			}
		],
		[]
	)

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel()
	})

	if (data.length === 0) return null

	return (
		<div className={styles.container}>
			<h3 className={styles.title}>Превью данных</h3>
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
