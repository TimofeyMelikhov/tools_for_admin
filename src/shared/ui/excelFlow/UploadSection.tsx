import type { ColumnMap, ExcelRow } from '@/shared/lib/excel/types'
import { ExcelUploader } from '@/shared/ui/excelUploader'

type Props = {
	isVisible: boolean
	columnMap: ColumnMap
	onSuccess: (data: ExcelRow[]) => void
}

export const UploadSection = ({ isVisible, columnMap, onSuccess }: Props) => {
	if (!isVisible) return null
	return <ExcelUploader onSuccess={onSuccess} columnMap={columnMap} />
}
