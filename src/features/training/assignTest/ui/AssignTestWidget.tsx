import { TrainingAssignWidget } from '@/features/training/assign'

export const AssignTestWidget = () => {
	return (
		<TrainingAssignWidget
			forcedAction='getAssessments'
			title='Назначение тестов'
			submitText='Назначить тест'
		/>
	)
}
