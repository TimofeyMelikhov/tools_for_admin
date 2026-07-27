import type { AssignAdaptationResponse } from '@/features/adaptation/assign/model/types'

import type { ExcelRow } from '@/shared/lib/excel'
import { ExcelPreviewTable } from '@/shared/ui/excelPreviewTable'

import styles from './assignAdaptation.module.scss'

export const AssignAdaptationErrors = ({
	data
}: {
	data?: AssignAdaptationResponse
}) => {
	if (!data) return null

	return (
		<>
			{!!data.dublicatePersons.length && (
				<div className={styles.errorsBlock}>
					Дубликаты в системе:
					<ExcelPreviewTable data={data.dublicatePersons} />
				</div>
			)}
			{!!data.notFoundPersons.length && (
				<div className={styles.errorsBlock}>
					Не найденные сотрудники:{' '}
					{data.notFoundPersons.map((person: ExcelRow) => person.fullname).join(', ')}
				</div>
			)}
			{!!data.notFoundProgramm.length && (
				<div className={styles.errorsBlock}>
					Не найдены программы для следующих сотрудников:{' '}
					{data.notFoundProgramm.join(', ')}
				</div>
			)}
			{!!data.haveAProgramm.length && (
				<div className={styles.errorsBlock}>
					Уже назначены программы для следующих сотрудников:{' '}
					{data.haveAProgramm.join(', ')}
				</div>
			)}
			{!!data.haventPosDate.length && (
				<div className={styles.errorsBlock}>
					У сотрудников отсутствуют поля "Дата найма" и/или "Дата вступления в
					должность":
					{data.haventPosDate.join(', ')}
				</div>
			)}
		</>
	)
}
