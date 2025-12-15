import { accessMenuApi } from '@/features/access/menu'
import { assignAdaptationApi } from '@/features/adaptation/assign/api/assignAdaptationApi'
import { groupManagementApi } from '@/features/groups/management'
import { mentorProfileApi } from '@/features/mentors/MentorProfile/api/mentorProfileUpdateApi'
import { rewardsUpdateApi } from '@/features/mentors/rewardsUpdate/api/rewardsUpdateApi'
import { trainingAssignApi } from '@/features/training/assign/api/trainingAssignApi'

export const apiSlices = [
	accessMenuApi,
	trainingAssignApi,
	groupManagementApi,
	assignAdaptationApi,
	rewardsUpdateApi,
	mentorProfileApi
] as const
