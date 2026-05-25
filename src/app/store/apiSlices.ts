import { accessMenuApi } from '@/features/access/menu'
import { assignAdaptationApi } from '@/features/adaptation/assign/api/assignAdaptationApi'
import { groupManagementApi } from '@/features/groups/management'
import { mentorsCheckDataApi } from '@/features/mentors/CheckMentorsData/api/mentorsCheckDataApi'
import { mentorProfileApi } from '@/features/mentors/MentorProfile/api/mentorProfileUpdateApi'
import { rewardsUpdateApi } from '@/features/mentors/rewardsUpdate/api/rewardsUpdateApi'
import { trainingAssignApi } from '@/features/training/assign/api/trainingAssignApi'
import { uploadingQuestionsApi } from '@/features/training/uploadingQuestions/api/uploadingQuestionsApi'

export const apiSlices = [
	accessMenuApi,
	trainingAssignApi,
	groupManagementApi,
	assignAdaptationApi,
	rewardsUpdateApi,
	mentorProfileApi,
	mentorsCheckDataApi,
	uploadingQuestionsApi
] as const
