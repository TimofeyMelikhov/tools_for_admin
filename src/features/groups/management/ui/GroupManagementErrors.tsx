import { ExcelPreviewTable } from '@/shared/ui/excelPreviewTable'

import { groupManagementColumnMap } from '../model/excelMapping'
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
					<ExcelPreviewTable
						data={data.dublicatePersons}
						columnMap={groupManagementColumnMap}
					/>
				</div>
			)}

			{!!data.notFoundPersons?.length && (
				<div>
					Не найденные сотрудники:
					<ExcelPreviewTable
						data={data.notFoundPersons}
						columnMap={groupManagementColumnMap}
					/>
				</div>
			)}
		</div>
	)
}
