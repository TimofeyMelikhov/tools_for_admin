import type { ServerResponse } from '@/shared/api/types'

export const stripDuplicateIds = (response: ServerResponse): ServerResponse => {
	return {
		...response,
		dublicatePersons: response.dublicatePersons.map(({ id, ...rest }) => rest)
	}
}
