import type { ColumnMap } from '@/shared/lib/excel'

export const mentorProfileColumnMap: ColumnMap = [
	['Специалист', 'fullname'],
	['Наставник', 'mentor'],
	['Дата изменения', 'date_modified'],
	['Должность специалиста', 'position_name'],
	['Должность наставника', 'mentor_position_name'],
	['Подразделение наставника', 'mentor_subdivision'],
	['Состояние', 'state'],
	['Вид наставничества', 'type_of_mentoring']
]
