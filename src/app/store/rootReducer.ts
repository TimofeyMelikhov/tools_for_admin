import { combineReducers } from '@reduxjs/toolkit'

import assignAdaptationSlice from '@/features/adaptation/assign/model/assignAdaptationSlice'
import { groupManagementReducer } from '@/features/groups/management'
import mentorProfileSlice from '@/features/mentors/MentorProfile/model/mentorProfileSlice'
import rewardsUpdateSlice from '@/features/mentors/rewardsUpdate/model/rewardsUpdateSlice'
import trainingAssignSlice from '@/features/training/assign/model/trainingAssignSlice'

import { apiSlices } from './apiSlices'

type ApiReducerPath = (typeof apiSlices)[number]['reducerPath']

const apiReducers = apiSlices.reduce(
	(acc, api) => {
		acc[api.reducerPath as ApiReducerPath] = api.reducer
		return acc
	},
	{} as Record<ApiReducerPath, (typeof apiSlices)[number]['reducer']>
)

export const rootReducer = combineReducers({
	...apiReducers,

	trainingAssign: trainingAssignSlice,
	groupManagement: groupManagementReducer,

	rewardsUpdate: rewardsUpdateSlice,
	mentorProfile: mentorProfileSlice,
	assignAdaptation: assignAdaptationSlice
})
