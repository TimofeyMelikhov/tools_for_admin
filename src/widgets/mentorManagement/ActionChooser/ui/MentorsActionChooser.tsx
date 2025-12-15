import { ActionChooser } from '@/shared/ui/actionChooser'

import { mentorManagementActions } from '../model/actions'

export const MentorManagementChooser = () => {
	return <ActionChooser items={mentorManagementActions} />
}
