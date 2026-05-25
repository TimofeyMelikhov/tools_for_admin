import * as XLSX from 'xlsx'

import type { ColumnMap, ExcelRow } from './types'

// Покрываем самые частые "странные пробелы" из Excel/HTML-экспорта.
// Можно расширять при необходимости.
const WEIRD_SPACES_RE =
	/[\s\u00A0\u1680\u2000-\u200A\u2007\u202F\u205F\u3000\uFEFF]+/g

function normalizeSpaces(value: string): string {
	return value.replace(WEIRD_SPACES_RE, ' ').trim()
}

function normalizeKey(str: string): string {
	// Сначала чистим "странные пробелы", потом приводим к единому виду
	const cleaned = normalizeSpaces(String(str))
	return cleaned
		.toLowerCase()
		.replace(/_+/g, ' ')
		.replace(WEIRD_SPACES_RE, ' ')
		.trim()
}

function formatExcelDate(serial: number): string {
	const dc = XLSX.SSF.parse_date_code(serial)
	const day = String(dc.d).padStart(2, '0')
	const month = String(dc.m).padStart(2, '0')
	const year = String(dc.y)
	return `${day}.${month}.${year}`
}

function isDateFormattedCell(format?: string): boolean {
	return !!format && XLSX.SSF.is_date(format)
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

				const rows: unknown[][] = XLSX.utils.sheet_to_json(worksheet, {
					header: 1,
					raw: true
				})

				if (rows.length < 2) {
					resolve([])
					return
				}

				// Нормализуем заголовки тоже (там часто живут NBSP)
				const headerRow: string[] = (rows[0] ?? []).map(v =>
					normalizeSpaces(String(v ?? ''))
				)

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

				const result: ExcelRow[] = dataRows.map((row, rowIndex) => {
					const newRow: ExcelRow = {}
					for (const key of allKeys) newRow[key] = null

					for (let col = 0; col < headerRow.length; col++) {
						const key = mapping.get(col)
						if (!key) continue

						const cellAddress = XLSX.utils.encode_cell({
							r: rowIndex + 1,
							c: col
						})
						const cell = worksheet[cellAddress]
						const cellValue = (row as unknown[])[col]
						let v: string | number | null

						if (cell && typeof cell.v === 'number') {
							if (isDateFormattedCell(cell.z)) {
								v = formatExcelDate(cell.v)
							} else {
								v = cell.v
							}
						} else if (typeof cellValue === 'number') {
							v = cellValue
						} else if (
							cellValue !== null &&
							cellValue !== undefined &&
							cellValue !== ''
						) {
							v = String(cellValue)
						} else {
							v = null
						}

						// Ключевой фикс: нормализуем пробелы для ЛЮБОГО string
						if (typeof v === 'string') {
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
