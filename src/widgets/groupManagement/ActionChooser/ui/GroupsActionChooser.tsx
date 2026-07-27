import { ActionChooser } from '@/shared/ui/actionChooser'

import { groupManagementActions } from '../model/actions'

export const GroupManagementChooser = () => {
	return <ActionChooser items={groupManagementActions} />
}
