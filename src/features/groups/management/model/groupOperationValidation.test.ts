import { describe, expect, it } from 'vitest'

import { getGroupOperationValidationError } from './groupOperationValidation'
import type { GroupManagementState } from './types'

const state: GroupManagementState = {
	selectedAction: null,
	excelObj: [],
	currentGroup: null,
	targetGroup: null,
	selectedUsers: [],
	selectedUser: null
}

describe('group operation validation', () => {
	it('requires a source group before an operation', () => {
		expect(getGroupOperationValidationError('addToGroup', state)).toBe(
			'Выберите группу'
		)
	})

	it('requires a target group and selected users for moving people', () => {
		const selectedGroup = {
			id: '1',
			code: 'group',
			name: 'Группа',
			modification_date: ''
		}

		expect(
			getGroupOperationValidationError('moveToGroup', {
				...state,
				currentGroup: selectedGroup
			})
		).toBe('Выберите целевую группу для перемещения')

		expect(
			getGroupOperationValidationError('moveToGroup', {
				...state,
				currentGroup: selectedGroup,
				targetGroup: { ...selectedGroup, id: '2' }
			})
		).toBe('Выберите сотрудников')
	})
})
