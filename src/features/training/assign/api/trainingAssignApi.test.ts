import { describe, expect, it, vi } from 'vitest'

vi.mock('@/shared/api/client', () => ({ apiRequest: vi.fn() }))

import { apiRequest } from '@/shared/api/client'

import { assignTraining, getCurrentList } from './trainingAssignApi'

describe('training assignment API', () => {
	it('uses the selected list method when requesting courses or assessments', async () => {
		await getCurrentList('getCourses')

		expect(apiRequest).toHaveBeenCalledWith({ apiMethod: 'getCourses' })
	})

	it('sends assignment payload through the data reducer endpoint', async () => {
		const payload = {
			selectedAction: null,
			currentObj: null,
			excelObj: [],
			time: ''
		}

		await assignTraining(payload)

		expect(apiRequest).toHaveBeenCalledWith({
			apiMethod: 'dataReducer',
			body: payload,
			httpMethod: 'post'
		})
	})
})
