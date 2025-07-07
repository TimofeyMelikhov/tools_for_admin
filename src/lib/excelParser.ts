import * as XLSX from 'xlsx'

export type ExcelRow = Record<string, string | number | null | undefined>

// Маппинг «Русское название столбца» → «ключ для JSON»
export const COLUMN_MAP: Record<string, string> = {
	Сотрудник: 'fullname',
	Должность: 'position_name',
	Отдел: 'position_parent_name',
	Почта: 'email'
}

// Основная функция чтения и маппинга Excel-файла
export async function parseExcelFile(file: File): Promise<ExcelRow[]> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()

		reader.onload = (event: ProgressEvent<FileReader>) => {
			try {
				const data = new Uint8Array(event.target!.result as ArrayBuffer)
				const workbook = XLSX.read(data, { type: 'array' })
				const sheetName = workbook.SheetNames[0]
				const worksheet = workbook.Sheets[sheetName]

				// Парсим в сырые объекты
				const rawData: Record<string, any>[] =
					XLSX.utils.sheet_to_json(worksheet)

				// Маппим ключи и гарантируем null для отсутствующих
				const mappedData: ExcelRow[] = rawData.map(row => {
					const newRow: ExcelRow = {}

					// Инициализируем все ключи из маппинга
					for (const rusKey in COLUMN_MAP) {
						newRow[COLUMN_MAP[rusKey]] = null
					}

					// Заполняем значениями из строки
					for (const [rusKey, value] of Object.entries(row)) {
						const engKey = COLUMN_MAP[rusKey]
						if (engKey) {
							newRow[engKey] = value != null && value !== '' ? value : null
						}
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
