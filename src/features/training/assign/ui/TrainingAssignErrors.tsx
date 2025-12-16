import type { ServerResponse } from '@/shared/api/types'
import { ExcelPreviewTable } from '@/shared/ui/excelPreviewTable'

import { trainingAssignColumnMap } from '../model/excelMapping'

type Props = {
	data?: ServerResponse
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
					Не найденные сотрудники:{' '}
					{data.notFoundPersons.map(p => p.fullname).join(', ')}
				</div>
			)}

			{!!data.prevAssign?.length && (
				<div>
					Были назначены ранее:{' '}
					{data.prevAssign.map(p => p.fullname).join(', ')}
				</div>
			)}
		</div>
	)
}
