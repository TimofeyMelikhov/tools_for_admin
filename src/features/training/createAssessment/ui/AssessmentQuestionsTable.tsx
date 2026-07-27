import { useMemo } from 'react'

import { Paper } from '@mui/material'
import {
	DataGrid,
	type GridColDef,
	type GridRowSelectionModel
} from '@mui/x-data-grid'
import { ruRU } from '@mui/x-data-grid/locales'

import type { AssessmentQuestion } from '../model/types'

type Props = {
	questions: AssessmentQuestion[]
	selectedQuestionIds: string[]
	questionSectionTitles: Record<string, string>
	onSelectedQuestionIdsChange: (ids: string[]) => void
}

export const AssessmentQuestionsTable = ({
	questions,
	selectedQuestionIds,
	questionSectionTitles,
	onSelectedQuestionIdsChange
}: Props) => {
	const columns: GridColDef<AssessmentQuestion>[] = useMemo(
		() => [
			{ field: 'code', headerName: 'Код', width: 140 },
			{ field: 'title', headerName: 'Вопрос', flex: 1, minWidth: 320 },
			{ field: 'type_id', headerName: 'Тип', width: 180 },
			{
				field: 'question_points',
				headerName: 'Баллы',
				width: 100,
				type: 'number'
			},
			{
				field: 'section',
				headerName: 'Раздел',
				width: 180,
				renderCell: params => questionSectionTitles[params.row.id] || '—'
			},
			{
				field: 'creation_date',
				headerName: 'Создан',
				width: 180
			}
		],
		[questionSectionTitles]
	)

	const rowSelectionModel: GridRowSelectionModel = useMemo(
		() => ({ type: 'include', ids: new Set(selectedQuestionIds) }),
		[selectedQuestionIds]
	)

	const handleSelectionChange = (selectionModel: GridRowSelectionModel) => {
		const selectedIds = selectionModel.ids
		onSelectedQuestionIdsChange(
			questions
				.filter(question =>
					selectionModel.type === 'exclude'
						? !selectedIds.has(question.id)
						: selectedIds.has(question.id)
				)
				.map(question => question.id)
		)
	}

	return (
		<Paper sx={{ height: 460, width: '100%' }}>
			<DataGrid
				rows={questions}
				columns={columns}
				getRowId={row => row.id}
				checkboxSelection
				rowSelectionModel={rowSelectionModel}
				onRowSelectionModelChange={handleSelectionChange}
				initialState={{
					pagination: { paginationModel: { page: 0, pageSize: 10 } }
				}}
				pageSizeOptions={[10, 25, 50]}
				sx={{ border: 0, fontSize: '14px' }}
				localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
			/>
		</Paper>
	)
}
