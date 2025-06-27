import type { ReactElement } from 'react'

import { MainPage } from '@/pages/mainPage/MainPage'
import { NotFoundPage } from '@/pages/notFound/NotFoundPage'
import { TrainingManagement } from '@/pages/training-management/TrainingManagement'

export type RouteConfig = {
	path: string
	element: ReactElement
	isProtected?: boolean
	children?: RouteConfig[]
}

export const routesConfig: RouteConfig[] = [
	{
		path: '/',
		element: <MainPage />
	},
	{
		path: '/TrainingManagement',
		element: <TrainingManagement />
	},
	{
		path: '*',
		element: <NotFoundPage />,
		isProtected: false
	}
]
