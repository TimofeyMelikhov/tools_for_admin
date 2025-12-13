import { useUpdateRewardsMutation } from '@/features/mentors/rewardsUpdate/api/rewardsUpdateApi'

import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux'
import type { ExcelRow } from '@/shared/lib/excel/types'

import { cleanExcelRewards, setExcelData } from './rewardsUpdateSlice'

export function useRewardsUpdate() {
	const dispatch = useAppDispatch()
	const [updateRewards, { data, isLoading }] = useUpdateRewardsMutation()

	const excelData = useAppSelector(state => state.rewardsUpdate.excelObj)
	const excelLength = useAppSelector(
		state => state.rewardsUpdate.excelObj.length
	)

	const onExcelParsed = (rows: ExcelRow[]) => dispatch(setExcelData(rows))
	const clearExcel = () => dispatch(cleanExcelRewards())

	const submit = async (excelObj: ExcelRow[]) => {
		return await updateRewards({ excelObj }).unwrap()
	}

	return {
		excelData,
		excelLength,
		isLoading,
		data,
		onExcelParsed,
		clearExcel,
		submit
	}
}
