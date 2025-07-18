import { configureStore } from '@reduxjs/toolkit'

import { accessApi } from './api/accessApi'
import { rewardsUpdateApi } from './api/rewardsUpdateApi'
import { tutorApi } from './api/tutorApi'
import actionSlice from './slices/actionSlice'
import rewardsUpdateSlice from './slices/rewardsUpdateSlice'

export const store = configureStore({
	reducer: {
		[tutorApi.reducerPath]: tutorApi.reducer,
		[accessApi.reducerPath]: accessApi.reducer,
		[rewardsUpdateApi.reducerPath]: rewardsUpdateApi.reducer,
		filters: actionSlice,
		rewardsUpdate: rewardsUpdateSlice
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware().concat(
			tutorApi.middleware,
			accessApi.middleware,
			rewardsUpdateApi.middleware
		)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
