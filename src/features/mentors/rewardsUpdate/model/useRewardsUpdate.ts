import { useExcelData } from '@/shared/lib/excel'

import { useUpdateRewardsMutation } from './queries'

export function useRewardsUpdate() {
	const { excelData, excelLength, onExcelParsed, clearExcel } = useExcelData()
	const {
		mutateAsync: updateRewards,
		data,
		isPending: isLoading
	} = useUpdateRewardsMutation()
	const submit = async (excelObj: typeof excelData) => {
		return updateRewards({ excelObj })
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
