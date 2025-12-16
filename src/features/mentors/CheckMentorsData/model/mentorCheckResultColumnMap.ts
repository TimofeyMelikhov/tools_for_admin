import type { ColumnMap } from '@/shared/lib/excel'

export const mentorCheckResultColumnMap: ColumnMap = [
	['Специалист', 'fullname'],
	['Проуцедура отбора', 'selection_procedure'],
	['Птенец в заботливых руках', 'mentor_award_chick'],
	['Мудрая сова', 'mentor_award_owl'],
	['Наставник', 'mentor'],
	['Дата изменения', 'date_modified'],
	['Должность специалиста', 'position_name'],
	['Должность наставника', 'mentor_position_name'],
	['Состояние', 'state'],
	['Вид наставничества', 'type_of_mentoring']
]
