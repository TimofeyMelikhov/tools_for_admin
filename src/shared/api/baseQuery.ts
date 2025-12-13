import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { baseServerPath } from '@/app/config'

export const baseQuery = fetchBaseQuery({
	baseUrl: baseServerPath,
	prepareHeaders(headers) {
		headers.set('Content-Type', 'application/json')
		return headers
	}
})
