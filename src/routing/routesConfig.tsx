import type { ReactElement } from 'react'

import { MainPage } from '@/pages/mainPage/MainPage'
import { MentorProfile } from '@/pages/mentorProfile/MentorProfile'
import { NotFoundPage } from '@/pages/notFound/NotFoundPage'
import { RewardsUpdate } from '@/pages/rewardsUpdate/RewardsUpdate'
import { TrainingManagement } from '@/pages/trainingManagement/TrainingManagement'

import { Layout } from '@/components/layout/Layout'

import { ProtectedRoute } from './ProtectedRoute'

export type RouteConfig = {
	path: string
	element: ReactElement
	children?: RouteConfig[]
}

export const routesConfig: RouteConfig[] = [
	{
		path: '/',
		element: <Layout />,
		children: [
			{
				path: '/',
				element: <MainPage />
			},
			{
				path: '/TrainingManagement',
				element: (
					<ProtectedRoute>
						<TrainingManagement />
					</ProtectedRoute>
				)
			},
			{
				path: '/RewardsUpdate',
				element: (
					<ProtectedRoute>
						<RewardsUpdate />
					</ProtectedRoute>
				)
			},
			{
				path: '/MentorProfile',
				element: (
					<ProtectedRoute>
						<MentorProfile />
					</ProtectedRoute>
				)
			},
			{
				path: '*',
				element: <NotFoundPage />
			}
		]
	}
]
