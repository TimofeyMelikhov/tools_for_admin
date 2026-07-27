import { useMemo } from 'react'

import { Paper } from '@mui/material'
import {
	DataGrid,
	type GridColDef,
	type GridRowSelectionModel
} from '@mui/x-data-grid'
import { ruRU } from '@mui/x-data-grid/locales'

import type { Person } from '@/entities/person'

interface EditGroupTableProps {
	personsList: Person[] | undefined
	mode?: 'view' | 'select'
	selectedUsers: Person[]
	onSelectedUsersChange: (users: Person[]) => void
}

export const EditGroupTable = ({
	personsList,
	mode = 'select',
	selectedUsers,
	onSelectedUsersChange
}: EditGroupTableProps) => {
	const columns: GridColDef[] = useMemo(
		() => [
			{ field: 'fullname', headerName: 'Сотрудник', width: 350 },
			{ field: 'position_name', headerName: 'Должность', width: 250 },
			{ field: 'position_parent_name', headerName: 'Подразделение', width: 350 }
		],
		[]
	)

	const checkboxSelection = mode === 'select'
	const paginationModel = { page: 0, pageSize: 5 }

	const rowSelectionModel: GridRowSelectionModel = useMemo(() => {
		const ids = new Set(selectedUsers.map(u => u.id))
		return { type: 'include', ids }
	}, [selectedUsers])

	const handleSelectionChange = (selectionModel: GridRowSelectionModel) => {
		if (!checkboxSelection) return

		const selectedIds = selectionModel.ids

		if (personsList) {
			const nextSelected = personsList.filter(p => selectedIds.has(p.id))
			onSelectedUsersChange(nextSelected)
		}
	}

	return (
		<Paper sx={{ height: 400, width: '100%' }}>
			<DataGrid
				rows={personsList ?? []}
				columns={columns}
				getRowId={row => row.id}
				initialState={{ pagination: { paginationModel } }}
				pageSizeOptions={[5, 10, 20]}
				checkboxSelection={checkboxSelection}
				rowSelectionModel={checkboxSelection ? rowSelectionModel : undefined}
				onRowSelectionModelChange={
					checkboxSelection ? handleSelectionChange : undefined
				}
				sx={{ border: 0, fontSize: '14px' }}
				localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
			/>
		</Paper>
	)
}
