import { accessMenuApi } from '@/features/access/menu'
import { assignAdaptationApi } from '@/features/adaptation/assign/api/assignAdaptationApi'
// пока legacy — можно потом перенести
import { groupManagementApi } from '@/features/groups/manage'
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
