import { Outlet, useLocation } from 'react-router-dom'

import { GroupManagementChooser } from '@/widgets/groupManagement/ActionChooser'

export function GroupManagementPage() {
	const location = useLocation()
	const isRoot =
		location.pathname === '/groupManagement' ||
		location.pathname === '/groupManagement/'

	return (
		<div style={{ padding: 16, display: 'grid', gap: 16 }}>
			<div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
				<h1 style={{ margin: 0 }}>Группы</h1>
				<span style={{ color: '#666' }}>
					Добавление, удаление и перемещение пользователей между группами,
					установка руководителя группы
				</span>
			</div>

			{isRoot ? (
				<GroupManagementChooser />
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
