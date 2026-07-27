import { TrainingAssignWidget } from '@/features/training/assign'

export const AssignCourseWidget = () => {
	return (
		<TrainingAssignWidget
			forcedAction='getCourses'
			title='Назначение курсов'
			submitText='Назначить курс'
		/>
	)
}
