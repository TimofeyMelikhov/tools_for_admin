import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { RewardsUpdateState } from '@/features/mentors/rewardsUpdate/model/types'

import type { ExcelRow } from '@/shared/lib/excel/types'

const initialState: RewardsUpdateState = {
	excelObj: []
}

const rewardsUpdateSlice = createSlice({
	name: 'rewardsUpdate',
	initialState,
	reducers: {
		setExcelData: (state, action: PayloadAction<ExcelRow[]>) => {
			state.excelObj = action.payload
		},
		cleanExcelRewards: state => {
			state.excelObj = []
		}
	}
})

export const { setExcelData, cleanExcelRewards } = rewardsUpdateSlice.actions
export default rewardsUpdateSlice.reducer
