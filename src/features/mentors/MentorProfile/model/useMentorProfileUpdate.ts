import { useExcelData } from '@/shared/lib/excel'

import { useMentorProfileMutation } from './queries'

export function useMentorProfileUpdate() {
	const { excelData, excelLength, onExcelParsed, clearExcel } = useExcelData()
	const {
		mutateAsync: updateMentorProfile,
		data,
		isPending: isLoading
	} = useMentorProfileMutation()
	const submit = async (excelObj: typeof excelData) => {
		return updateMentorProfile({ excelObj })
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
