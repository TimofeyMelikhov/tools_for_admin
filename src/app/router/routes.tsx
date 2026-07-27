import { type ReactElement, Suspense, lazy } from 'react'

import { AppLayout } from '@/widgets/layout'

import { Preloader } from '@/shared/ui/preloader'

import { ProtectedRoute } from './ProtectedRoute'

const MainPage = lazy(() =>
	import('@/pages/main').then(module => ({ default: module.MainPage }))
)
const TrainingManagement = lazy(() =>
	import('@/pages/trainingManagement').then(module => ({
		default: module.TrainingManagement
	}))
)
const AssignCourseWidget = lazy(() =>
	import('@/features/training/assignCourse').then(module => ({
		default: module.AssignCourseWidget
	}))
)
const AssignTestWidget = lazy(() =>
	import('@/features/training/assignTest').then(module => ({
		default: module.AssignTestWidget
	}))
)

const UploadingQuestionsWidget = lazy(() =>
	import('@/features/training/uploadingQuestions').then(module => ({
		default: module.UploadingQuestionsWidget
	}))
)
const CreateAssessmentWidget = lazy(() =>
	import('@/features/training/createAssessment').then(module => ({
		default: module.CreateAssessmentWidget
	}))
)
const GroupManagement = lazy(() =>
	import('@/pages/groupManagement').then(module => ({
		default: module.GroupManagement
	}))
)
const AddToGroupWidget = lazy(() =>
	import('@/features/groups/addToGroup').then(module => ({
		default: module.AddToGroupWidget
	}))
)
const RemovePersonWidget = lazy(() =>
	import('@/features/groups/removePerson').then(module => ({
		default: module.RemovePersonWidget
	}))
)
const MovePersonWidget = lazy(() =>
	import('@/features/groups/movePerson').then(module => ({
		default: module.MovePersonWidget
	}))
)
const InstallLeadWidget = lazy(() =>
	import('@/features/groups/installLead').then(module => ({
		default: module.InstallLeadWidget
	}))
)
const AssignAdaptation = lazy(() =>
	import('@/pages/assignAdaptation').then(module => ({
		default: module.AssignAdaptation
	}))
)
const MentorManagementPage = lazy(() =>
	import('@/pages/mentorManagement').then(module => ({
		default: module.MentorManagementPage
	}))
)
const RewardsUpdateWidget = lazy(() =>
	import('@/features/mentors/rewardsUpdate').then(module => ({
		default: module.RewardsUpdateWidget
	}))
)
const MentorProfileUpdateWidget = lazy(() =>
	import('@/features/mentors/MentorProfile').then(module => ({
		default: module.MentorProfileUpdateWidget
	}))
)
const CheckMentorsDataWidget = lazy(() =>
	import('@/features/mentors/CheckMentorsData').then(module => ({
		default: module.CheckMentorsDataWidget
	}))
)
const NotFoundPage = lazy(() =>
	import('@/pages/notFound').then(module => ({ default: module.NotFoundPage }))
)

const withSuspense = (element: ReactElement) => (
	<Suspense fallback={<Preloader />}>{element}</Suspense>
)

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
			{ path: '/', element: withSuspense(<MainPage />) },
			{
				path: '/TrainingManagement',
				element: withSuspense(
					<ProtectedRoute>
						<TrainingManagement />
					</ProtectedRoute>
				),
				children: [
					{ path: '', element: <div /> },
					{ path: 'course', element: withSuspense(<AssignCourseWidget />) },
					{
						path: 'assessment',
						element: withSuspense(<AssignTestWidget />)
					},
					{
						path: 'questions',
						element: withSuspense(<UploadingQuestionsWidget />)
					},
					{
						path: 'create-assessment',
						element: withSuspense(<CreateAssessmentWidget />)
					}
				]
			},
			{
				path: '/groupManagement',
				element: withSuspense(
					<ProtectedRoute>
						<GroupManagement />
					</ProtectedRoute>
				),
				children: [
					{ path: '', element: <div /> },
					{ path: 'add', element: withSuspense(<AddToGroupWidget />) },
					{ path: 'remove', element: withSuspense(<RemovePersonWidget />) },
					{ path: 'move', element: withSuspense(<MovePersonWidget />) },
					{ path: 'leader', element: withSuspense(<InstallLeadWidget />) }
				]
			},
			{
				path: '/AssignAdapt',
				element: withSuspense(
					<ProtectedRoute>
						<AssignAdaptation />
					</ProtectedRoute>
				)
			},
			{
				path: '/mentorManagement',
				element: withSuspense(
					<ProtectedRoute>
						<MentorManagementPage />
					</ProtectedRoute>
				),
				children: [
					{ path: '', element: <div /> },
					{
						path: 'RewardsUpdate',
						element: withSuspense(<RewardsUpdateWidget />)
					},
					{
						path: 'MentorProfile',
						element: withSuspense(<MentorProfileUpdateWidget />)
					},
					{
						path: 'checkData',
						element: withSuspense(<CheckMentorsDataWidget />)
					}
				]
			},
			{ path: '*', element: withSuspense(<NotFoundPage />) }
		]
	}
]
