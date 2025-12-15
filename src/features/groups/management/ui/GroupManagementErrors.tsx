import { ExcelPreviewTable } from '@/shared/ui/excelPreviewTable'

import type { ManagementGroupResponse } from '../model/types'

type Props = {
	data?: ManagementGroupResponse
	className?: string
}

export const GroupManagementErrors = ({ data, className }: Props) => {
	if (!data) return null

	return (
		<div className={className}>
			{!!data.dublicatePersons?.length && (
				<div>
					Дубликаты в системе:
					<ExcelPreviewTable data={data.dublicatePersons} />
				</div>
			)}

			{!!data.notFoundPersons?.length && (
				<div>
					Не найденные сотрудники:{' '}
					{data.notFoundPersons.map(p => p.fullname).join(', ')}
				</div>
			)}
		</div>
	)
}
