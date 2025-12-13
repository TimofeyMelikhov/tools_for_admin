// src/app/store/store.ts
import { configureStore } from '@reduxjs/toolkit'

import { apiSlices } from './apiSlices'
import { rootReducer } from './rootReducer'

export const store = configureStore({
	reducer: rootReducer,
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware().concat(...apiSlices.map(api => api.middleware))
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
