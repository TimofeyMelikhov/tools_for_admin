import type { ExcelOperationResponse } from '@/shared/api/types'
import { ExcelPreviewTable } from '@/shared/ui/excelPreviewTable'

import { trainingAssignColumnMap } from '../model/excelMapping'

type Props = {
	data?: ExcelOperationResponse
	className?: string
}

export const TrainingAssignErrors = ({ data, className }: Props) => {
	if (!data) return null

	return (
		<div className={className}>
			{!!data.dublicatePersons?.length && (
				<div>
					Дубликаты в системе:
					<ExcelPreviewTable
						data={data.dublicatePersons}
						columnMap={trainingAssignColumnMap}
					/>
				</div>
			)}

			{!!data.notFoundPersons?.length && (
				<div>
					Не найденные сотрудники:
					<ExcelPreviewTable
						data={data?.notFoundPersons ?? []}
						columnMap={trainingAssignColumnMap}
					/>
				</div>
			)}

			{!!data.prevAssign?.length && (
				<div>
					Были назначены ранее:
					<ExcelPreviewTable
						data={data?.prevAssign ?? []}
						columnMap={trainingAssignColumnMap}
					/>
				</div>
			)}
		</div>
	)
}
