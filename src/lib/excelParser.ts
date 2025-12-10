import * as XLSX from 'xlsx'

export type ExcelRow = Record<string, string | number | null | undefined>

// Обновляем маппинг с поддержкой нескольких слов
export const COLUMN_MAP = new Map([
	['Сотрудник', 'fullname'],
	['Должность', 'position_name'],
	['Отдел', 'position_parent_name'],
	['Птенец', 'chick'],
	['Сова', 'owl'],
	['Процедура отбора', 'mentor']
])

// Нормализация строки для сравнения
function normalizeKey(str: string): string {
	return str
		.toLowerCase()
		.replace(/[_\s]+/g, ' ') // Заменяем подчеркивания и множественные пробелы на один пробел
		.trim()
}

// Старые функции остаются без изменений
function normalizeSpaces(
	str: string | number | null | undefined
): string | number | null | undefined {
	if (typeof str !== 'string') return str
	return str.replace(/\s+/g, ' ').trim()
}

function formatExcelDate(serial: number): string {
	const dc = XLSX.SSF.parse_date_code(serial)
	const day = String(dc.d).padStart(2, '0')
	const month = String(dc.m).padStart(2, '0')
	const year = String(dc.y)
	return `${day}.${month}.${year}`
}

export async function parseExcelFile(file: File): Promise<ExcelRow[]> {
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

				// Создаем маппинг для колонок на основе нормализованных заголовков
				const columnMapping = new Map<number, string>()

				headerRow.forEach((header, index) => {
					const normalizedHeader = normalizeKey(header)

					// Ищем подходящий ключ в COLUMN_MAP
					for (const [rusKey, engKey] of COLUMN_MAP.entries()) {
						if (normalizeKey(rusKey) === normalizedHeader) {
							columnMapping.set(index, engKey)
							break
						}
					}
				})

				const mappedData: ExcelRow[] = dataRows.map(row => {
					const newRow: ExcelRow = {}

					// Инициализируем все поля из COLUMN_MAP
					for (const engKey of COLUMN_MAP.values()) {
						newRow[engKey] = null
					}

					// Заполняем данные на основе маппинга
					for (let col = 0; col < headerRow.length; col++) {
						const engKey = columnMapping.get(col)
						if (!engKey) continue

						const cellValue = row[col]
						let processedValue: string | number | null | undefined

						if (typeof cellValue === 'number') {
							processedValue = formatExcelDate(cellValue)
						} else if (
							cellValue !== null &&
							cellValue !== undefined &&
							cellValue !== ''
						) {
							processedValue = cellValue
						} else {
							processedValue = null
						}

						// Нормализуем пробелы для текстовых полей
						if (
							['fullname', 'position_name', 'position_parent_name'].includes(
								engKey
							) &&
							typeof processedValue === 'string'
						) {
							processedValue = normalizeSpaces(processedValue) as string
						}

						newRow[engKey] = processedValue
					}
					return newRow
				})

				resolve(mappedData)
			} catch (err) {
				reject(err)
			}
		}

		reader.onerror = reject
		reader.readAsArrayBuffer(file)
	})
}
