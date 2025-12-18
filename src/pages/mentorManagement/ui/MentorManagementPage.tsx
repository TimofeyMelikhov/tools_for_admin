import { Outlet, useLocation } from 'react-router-dom'

import { MentorManagementChooser } from '@/widgets/mentorManagement/ActionChooser'

export function MentorManagementPage() {
	const location = useLocation()
	const isRoot =
		location.pathname === '/mentorManagement' ||
		location.pathname === '/mentorManagement/'

	return (
		<div style={{ padding: 16, display: 'grid', gap: 16 }}>
			<div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
				<h1 style={{ margin: 0 }}>Наставники</h1>
				<span style={{ color: '#666' }}>
					Установка наград, процедур отбора и сверка данных
				</span>
			</div>

			{isRoot ? (
				<MentorManagementChooser />
			) : (
				<div
					style={{ border: '1px solid #eee', borderRadius: 12, padding: 16 }}
				>
					<Outlet />
				</div>
			)}
		</div>
	)
}
