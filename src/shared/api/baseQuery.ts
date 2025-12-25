import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { BASE_SERVER_PATH } from '@/shared/config'

export const baseQuery = fetchBaseQuery({
	baseUrl: BASE_SERVER_PATH,
	prepareHeaders(headers) {
		headers.set('Content-Type', 'application/json')
		return headers
	}
})
