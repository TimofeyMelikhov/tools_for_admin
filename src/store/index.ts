import { configureStore } from '@reduxjs/toolkit'

import { accessApi } from './api/accessApi'
import { assignAdaptationApi } from './api/assignAdaptationApi'
import { employeApi } from './api/employeApi'
import { groupManagmentApi } from './api/groupManagmentApi'
import { tutorApi } from './api/tutorApi'
import assignAdaptationSlice from './slices/assignAdaptationSlice'
import groupManagementSlice from './slices/groupManagementSlice'
import mentorProfileSlice from './slices/mentorProfileSlice'
import rewardsUpdateSlice from './slices/rewardsUpdateSlice'
import tutorSlice from './slices/tutorSlice'

export const store = configureStore({
	reducer: {
		[tutorApi.reducerPath]: tutorApi.reducer,
		[accessApi.reducerPath]: accessApi.reducer,
		[employeApi.reducerPath]: employeApi.reducer,
		[groupManagmentApi.reducerPath]: groupManagmentApi.reducer,
		[assignAdaptationApi.reducerPath]: assignAdaptationApi.reducer,
		filters: tutorSlice,
		rewardsUpdate: rewardsUpdateSlice,
		mentorProfile: mentorProfileSlice,
		groupManagementSlice,
		assignAdaptationSlice
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware().concat(
			tutorApi.middleware,
			accessApi.middleware,
			employeApi.middleware,
			groupManagmentApi.middleware,
			assignAdaptationApi.middleware
		)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
