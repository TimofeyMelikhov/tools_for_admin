import { useMutation } from '@tanstack/react-query'

import { checkMentorsData } from '../api/mentorsCheckDataApi'

export const useMentorsCheckDataMutation = () =>
	useMutation({ mutationFn: checkMentorsData })
