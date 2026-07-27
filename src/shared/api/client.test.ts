import { http, HttpResponse } from 'msw'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/shared/config', () => ({
	BASE_SERVER_PATH: 'http://api.test',
	BASE_URL_OBJECT_ID: 'test-object'
}))

import { apiRequest } from './client'
import { ApiMethods } from './types'
import { server } from '@/test/server'

describe('apiRequest', () => {
	it('adds object_id and api method to a GET request', async () => {
		server.use(
			http.get('http://api.test/', ({ request }) => {
				const url = new URL(request.url)
				expect(url.searchParams.get('object_id')).toBe('test-object')
				expect(url.searchParams.get('method')).toBe(ApiMethods.GET_GROUPS)
				return HttpResponse.json([{ id: 'group-1' }])
			})
		)

		await expect(
			apiRequest<{ id: string }[]>({ apiMethod: ApiMethods.GET_GROUPS })
		).resolves.toEqual([{ id: 'group-1' }])
	})

	it('sends a JSON body for POST requests', async () => {
		server.use(
			http.post('http://api.test/', async ({ request }) => {
				expect(await request.json()).toEqual({ search: 'иван' })
				return HttpResponse.json([])
			})
		)

		await expect(
			apiRequest<unknown[], { search: string }>({
				apiMethod: ApiMethods.GET_COLLABORATORS,
				body: { search: 'иван' },
				httpMethod: 'post'
			})
		).resolves.toEqual([])
	})
})
