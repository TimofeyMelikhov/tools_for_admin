import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

type SelectOption = {
	value: string
	label: string
}

interface IInitialState {
	selectedAction: SelectOption | null
}

const initialState: IInitialState = {
	selectedAction: null
}

const actionSlice = createSlice({
	name: 'filters',
	initialState,
	reducers: {
		setFilters: (state, action: PayloadAction<SelectOption | null>) => {
			state.selectedAction = action.payload
		}
	}
})

export const { setFilters } = actionSlice.actions
export default actionSlice.reducer
