import axios, { type AxiosRequestConfig } from 'axios'

import { BASE_SERVER_PATH, BASE_URL_OBJECT_ID } from '@/shared/config'

import type { ApiMethods } from './types'

type RequestOptions<TBody> = {
	apiMethod: (typeof ApiMethods)[keyof typeof ApiMethods] | string
	body?: TBody
	httpMethod?: AxiosRequestConfig['method']
}

const client = axios.create({
	baseURL: BASE_SERVER_PATH,
	headers: { 'Content-Type': 'application/json' }
})

export const apiRequest = async <TResponse, TBody = undefined>({
	apiMethod,
	body,
	httpMethod = 'get'
}: RequestOptions<TBody>): Promise<TResponse> => {
	const { data } = await client.request<TResponse>({
		url: '',
		method: httpMethod,
		params: {
			object_id: BASE_URL_OBJECT_ID,
			method: apiMethod
		},
		data: body
	})

	return data
}
