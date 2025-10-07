import { useMemo } from 'react'

import { Paper } from '@mui/material'
import {
	DataGrid,
	type GridColDef,
	type GridRowSelectionModel
} from '@mui/x-data-grid'
import { ruRU } from '@mui/x-data-grid/locales'

import { setUsersToSelectList } from '@/store/slices/groupManagementSlice'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'

import type { IPersonFromServer } from '@/models/filtersModel'

interface EditGroupTableProps {
	personsList: IPersonFromServer[] | undefined
	mode?: 'view' | 'select'
}

export const EditGroupTable = ({
	personsList,
	mode = 'select'
}: EditGroupTableProps) => {
	const columns: GridColDef[] = [
		{ field: 'fullname', headerName: 'Сотрудник', width: 350 },
		{ field: 'position_name', headerName: 'Должность', width: 250 },
		{ field: 'position_parent_name', headerName: 'Подразделение', width: 350 }
	]
	const checkboxSelection = mode === 'select'
	const paginationModel = { page: 0, pageSize: 5 }
	const dispatch = useAppDispatch()

	const usersToRemove = useAppSelector(
		state => state.groupManagementSlice.selectedUsers
	)
	const rowSelectionModel: GridRowSelectionModel = useMemo(() => {
		const ids = new Set(usersToRemove.map(u => u.id!))
		return { type: 'include', ids }
	}, [usersToRemove])

	const handleSelectionChange = (selectionModel: GridRowSelectionModel) => {
		if (!checkboxSelection) return
		const selectedIds = Array.from(selectionModel.ids)
		if (personsList) {
			const selectedUsers = personsList.filter(
				p => p.id !== undefined && selectedIds.includes(p.id)
			)
			dispatch(setUsersToSelectList(selectedUsers))
		}
	}

	return (
		<Paper sx={{ height: 400, width: '100%' }}>
			<DataGrid
				rows={personsList}
				columns={columns}
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
