import type { ReactElement } from 'react'

import { AssignAdaptation } from '@/pages/assignAdaptation'
import { GroupManagement } from '@/pages/groupManagement'
import { MainPage } from '@/pages/main'
import { MentorManagementPage } from '@/pages/mentorManagement'
import { NotFoundPage } from '@/pages/notFound/'
import { TrainingManagement } from '@/pages/trainingManagement'

import { AppLayout } from '@/widgets/layout'

import { AddToGroupWidget } from '@/features/groups/addToGroup'
import { InstallLeadWidget } from '@/features/groups/installLead'
import { MovePersonWidget } from '@/features/groups/movePerson'
import { RemovePersonWidget } from '@/features/groups/removePerson'
import { CheckMentorsDataWidget } from '@/features/mentors/CheckMentorsData'
import { MentorProfileUpdateWidget } from '@/features/mentors/MentorProfile'
import { RewardsUpdateWidget } from '@/features/mentors/rewardsUpdate'
import { AssignCourseWidget } from '@/features/training/assignCourse'
import { AssignTestWidget } from '@/features/training/assignTest'

import { ProtectedRoute } from './ProtectedRoute'

export type RouteConfig = {
	path: string
	element: ReactElement
	children?: RouteConfig[]
}

export const routesConfig: RouteConfig[] = [
	{
		path: '/',
		element: <AppLayout />,
		children: [
			{ path: '/', element: <MainPage /> },
			{
				path: '/TrainingManagement',
				element: (
					<ProtectedRoute>
						<TrainingManagement />
					</ProtectedRoute>
				),
				children: [
					{ path: '', element: <div /> },
					{ path: 'course', element: <AssignCourseWidget /> },
					{ path: 'assessment', element: <AssignTestWidget /> }
				]
			},
			{
				path: '/groupManagement',
				element: (
					<ProtectedRoute>
						<GroupManagement />
					</ProtectedRoute>
				),
				children: [
					{ path: '', element: <div /> },
					{ path: 'add', element: <AddToGroupWidget /> },
					{ path: 'remove', element: <RemovePersonWidget /> },
					{ path: 'move', element: <MovePersonWidget /> },
					{ path: 'leader', element: <InstallLeadWidget /> }
				]
			},
			{
				path: '/AssignAdapt',
				element: (
					<ProtectedRoute>
						<AssignAdaptation />
					</ProtectedRoute>
				)
			},
			{
				path: '/mentorManagement',
				element: (
					<ProtectedRoute>
						<MentorManagementPage />
					</ProtectedRoute>
				),
				children: [
					{ path: '', element: <div /> },
					{ path: 'RewardsUpdate', element: <RewardsUpdateWidget /> },
					{ path: 'MentorProfile', element: <MentorProfileUpdateWidget /> },
					{ path: 'checkData', element: <CheckMentorsDataWidget /> }
				]
			},
			{ path: '*', element: <NotFoundPage /> }
		]
	}
]
