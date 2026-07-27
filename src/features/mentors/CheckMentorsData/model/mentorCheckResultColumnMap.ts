import type { ColumnMap } from '@/shared/lib/excel'

export const mentorCheckResultColumnMap: ColumnMap = [
	['Специалист', 'fullname'],
	['Наставник', 'mentor'],
	['Процедура отбора', 'selection_procedure'],
	['Птенец в заботливых руках', 'mentor_award_chick'],
	['Мудрая сова', 'mentor_award_owl'],
	['Дата изменения', 'date_modified'],
	['Должность специалиста', 'position_name'],
	['Должность наставника', 'mentor_position_name'],
	['Подразделение наставника', 'mentor_subdivision'],
	['Состояние', 'state'],
	['Вид наставничества', 'type_of_mentoring']
]
