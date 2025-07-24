import { configureStore } from '@reduxjs/toolkit'

import { accessApi } from './api/accessApi'
import { employeApi } from './api/employeApi'
import { tutorApi } from './api/tutorApi'
import mentorProfileSlice from './slices/mentorProfileSlice'
import rewardsUpdateSlice from './slices/rewardsUpdateSlice'
import tutorSlice from './slices/tutorSlice'

export const store = configureStore({
	reducer: {
		[tutorApi.reducerPath]: tutorApi.reducer,
		[accessApi.reducerPath]: accessApi.reducer,
		[employeApi.reducerPath]: employeApi.reducer,
		filters: tutorSlice,
		rewardsUpdate: rewardsUpdateSlice,
		mentorProfile: mentorProfileSlice
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware().concat(
			tutorApi.middleware,
			accessApi.middleware,
			employeApi.middleware
		)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
