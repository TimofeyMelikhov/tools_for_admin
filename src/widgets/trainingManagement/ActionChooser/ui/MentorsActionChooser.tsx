import { ActionChooser } from '@/shared/ui/actionChooser'

import { trainingManagementActions } from '../model/actions'

export const TrainingManagementChooser = () => {
	return <ActionChooser items={trainingManagementActions} />
}
