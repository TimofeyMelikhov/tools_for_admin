import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable
} from '@tanstack/react-table'
import React from 'react'

import {
	Box,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography
} from '@mui/material'

import type { ExcelRow } from '@/lib/excelParser'

interface ExcelPreviewTableProps {
	data: ExcelRow[]
}

export const ExcelPreviewTable: React.FC<ExcelPreviewTableProps> = ({
	data
}) => {
	// Определяем колонки таблицы
	const columns: ColumnDef<ExcelRow>[] = React.useMemo(
		() => [
			{
				header: 'Сотрудник',
				accessorKey: 'person',
				cell: info => info.getValue() ?? '-'
			},
			{
				header: 'Должность',
				accessorKey: 'position',
				cell: info => info.getValue() ?? '-'
			},
			{
				header: 'Отдел',
				accessorKey: 'subdivision',
				cell: info => info.getValue() ?? '-'
			},
			{
				header: 'Код',
				accessorKey: 'elemCode',
				cell: info => info.getValue() ?? '-'
			},
			{
				header: 'Срок',
				accessorKey: 'time',
				cell: info => info.getValue() ?? '-'
			},
			{
				header: 'Количество',
				accessorKey: 'count',
				cell: info => info.getValue() ?? '-'
			}
		],
		[]
	)

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel()
	})

	if (data.length === 0) {
		return null
	}

	return (
		<Box mt={4}>
			<Typography variant='h6' gutterBottom>
				Превью данных
			</Typography>
			<TableContainer
				component={Paper}
				sx={{ maxHeight: 400, overflow: 'auto' }}
			>
				<Table stickyHeader size='small'>
					<TableHead>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map(header => (
									<TableCell key={header.id}>
										{flexRender(
											header.column.columnDef.header,
											header.getContext()
										)}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableHead>
					<TableBody>
						{table.getRowModel().rows.map(row => (
							<TableRow key={row.id}>
								{row.getVisibleCells().map(cell => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<Typography variant='caption' display='block' mt={1}>
				Всего строк: {data.length}
			</Typography>
		</Box>
	)
}
