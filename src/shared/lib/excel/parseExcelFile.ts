import * as XLSX from 'xlsx'

import type { ColumnMap, ExcelRow } from './types'

function normalizeKey(str: string): string {
	return str
		.toLowerCase()
		.replace(/[_\s]+/g, ' ')
		.trim()
}

function normalizeSpaces(value: string): string {
	return value.replace(/\s+/g, ' ').trim()
}

function formatExcelDate(serial: number): string {
	const dc = XLSX.SSF.parse_date_code(serial)
	const day = String(dc.d).padStart(2, '0')
	const month = String(dc.m).padStart(2, '0')
	const year = String(dc.y)
	return `${day}.${month}.${year}`
}

export async function parseExcelFile(
	file: File,
	columnMap: ColumnMap
): Promise<ExcelRow[]> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()

		reader.onload = (event: ProgressEvent<FileReader>) => {
			try {
				const data = new Uint8Array(event.target!.result as ArrayBuffer)
				const workbook = XLSX.read(data, { type: 'array', cellDates: false })
				const sheetName = workbook.SheetNames[0]
				const worksheet = workbook.Sheets[sheetName]

				const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, {
					header: 1,
					raw: true
				})

				if (rows.length < 2) {
					resolve([])
					return
				}

				const headerRow: string[] = rows[0].map(String)
				const dataRows = rows.slice(1)

				const mapping = new Map<number, string>()
				const normalizedPairs = columnMap.map(
					([rus, key]) => [normalizeKey(rus), key] as const
				)

				headerRow.forEach((header, index) => {
					const normalized = normalizeKey(header)
					for (const [nRus, key] of normalizedPairs) {
						if (nRus === normalized) {
							mapping.set(index, key)
							break
						}
					}
				})

				const allKeys = Array.from(new Set(columnMap.map(([, key]) => key)))

				const result: ExcelRow[] = dataRows.map(row => {
					const newRow: ExcelRow = {}
					for (const key of allKeys) newRow[key] = null

					for (let col = 0; col < headerRow.length; col++) {
						const key = mapping.get(col)
						if (!key) continue

						const cellValue = row[col]
						let v: string | number | null | undefined

						if (typeof cellValue === 'number') v = formatExcelDate(cellValue)
						else if (
							cellValue !== null &&
							cellValue !== undefined &&
							cellValue !== ''
						)
							v = cellValue
						else v = null

						if (
							typeof v === 'string' &&
							['fullname', 'position_name', 'position_parent_name'].includes(
								key
							)
						) {
							v = normalizeSpaces(v)
						}

						newRow[key] = v
					}

					return newRow
				})

				resolve(result)
			} catch (err) {
				reject(err)
			}
		}

		reader.onerror = reject
		reader.readAsArrayBuffer(file)
	})
}
