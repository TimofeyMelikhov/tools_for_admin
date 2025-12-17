import React, { useCallback } from 'react'

import Button from '@mui/material/Button'
import * as XLSX from 'xlsx'

import type { DownloadExcelButtonProps, Primitive } from '../model/types'

function toCellValue(value: unknown): Primitive {
	if (value instanceof Date) return value
	if (value === null || value === undefined) return ''
	if (
		typeof value === 'string' ||
		typeof value === 'number' ||
		typeof value === 'boolean'
	)
		return value
	try {
		return JSON.stringify(value)
	} catch {
		return String(value)
	}
}

function ensureXlsxExt(name: string) {
	const trimmed = name.trim()
	if (!trimmed) return 'export.xlsx'
	return trimmed.toLowerCase().endsWith('.xlsx') ? trimmed : `${trimmed}.xlsx`
}

function clamp(n: number, min: number, max: number) {
	return Math.max(min, Math.min(max, n))
}

export const DownloadExcelButton: React.FC<
	DownloadExcelButtonProps
> = props => {
	const {
		buttonText,
		fileName,
		data,
		columnMap,
		sheetName = 'Sheet1',
		disabled,
		...buttonProps
	} = props

	const handleDownload = useCallback(() => {
		if (!Array.isArray(data) || data.length === 0) return

		const headers = columnMap.map(([rusHeader]) => rusHeader)

		const aoa: Primitive[][] = [headers]

		for (const row of data) {
			const line = columnMap.map(([, fieldKey]) => toCellValue(row[fieldKey]))
			aoa.push(line)
		}

		const ws = XLSX.utils.aoa_to_sheet(aoa)

		// авто-ширины колонок
		const colsWidth = columnMap.map(([rusHeader, fieldKey]) => {
			let maxLen = String(rusHeader ?? '').length
			for (const row of data) {
				const v = toCellValue(row[fieldKey])
				const s = v instanceof Date ? v.toISOString() : String(v ?? '')
				maxLen = Math.max(maxLen, s.length)
			}
			return { wch: clamp(maxLen + 2, 10, 60) }
		})
		;(ws as any)['!cols'] = colsWidth

		const wb = XLSX.utils.book_new()
		XLSX.utils.book_append_sheet(wb, ws, sheetName)

		XLSX.writeFile(wb, ensureXlsxExt(fileName), { compression: true })
	}, [columnMap, data, fileName, sheetName])

	const isDisabled = disabled ?? data.length === 0

	return (
		<Button {...buttonProps} disabled={isDisabled} onClick={handleDownload}>
			{buttonText}
		</Button>
	)
}
