import { useMutation } from '@tanstack/react-query'

import { updateRewards } from '../api/rewardsUpdateApi'

export const useUpdateRewardsMutation = () =>
	useMutation({ mutationFn: updateRewards })
