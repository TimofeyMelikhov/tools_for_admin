import { configureStore } from '@reduxjs/toolkit'

import actionSlice from './actionSlice'
import { tutorApi } from './tutorApi'

export const store = configureStore({
	reducer: {
		[tutorApi.reducerPath]: tutorApi.reducer,
		filters: actionSlice
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware().concat(tutorApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
