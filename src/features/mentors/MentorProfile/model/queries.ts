import { useMutation } from '@tanstack/react-query'

import { updateMentorProfile } from '../api/mentorProfileUpdateApi'

export const useMentorProfileMutation = () =>
	useMutation({ mutationFn: updateMentorProfile })
