import React from 'react'

import { Button } from '@mui/material'

import type { ColumnMap, ExcelRow } from '@/shared/lib/excel/types'
import { ExcelPreviewTable } from '@/shared/ui/excelPreviewTable'

type Props = {
	excelData: ExcelRow[]
	columnMap?: ColumnMap
	isVisibleTitle: boolean
	previewTitle: string
	clearButton: string
	onClear: () => void
	classNameTableTitle?: string

	// ✅ добавили
	controlsSlot?: React.ReactNode
}

export const PreviewSection = ({
	excelData,
	isVisibleTitle,
	previewTitle,
	clearButton,
	onClear,
	classNameTableTitle,
	controlsSlot,
	columnMap
}: Props) => {
	return (
		<>
			{isVisibleTitle && (
				<div className={classNameTableTitle}>
					<div>{controlsSlot ? controlsSlot : previewTitle}</div>
					<div>
						<Button
							variant='text'
							component='span'
							sx={{ fontSize: '12px' }}
							onClick={onClear}
						>
							{clearButton}
						</Button>
					</div>
				</div>
			)}

			<ExcelPreviewTable data={excelData} columnMap={columnMap} />
		</>
	)
}
