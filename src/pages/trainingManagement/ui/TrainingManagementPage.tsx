import { Outlet, useLocation } from 'react-router-dom'

import { TrainingManagementChooser } from '@/widgets/trainingManagement/ActionChooser'

export function TrainingManagementPage() {
	const location = useLocation()
	const isRoot =
		location.pathname === '/TrainingManagement' ||
		location.pathname === '/TrainingManagement/'

	return (
		<div style={{ padding: 16, display: 'grid', gap: 16, minWidth: 0 }}>
			<div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
				<h1 style={{ margin: 0 }}>Обучение</h1>
				<span style={{ color: '#666' }}>Менеджмент обучения</span>
			</div>

			{isRoot ? (
				<TrainingManagementChooser />
			) : (
				<div
					style={{
						border: '1px solid #eee',
						borderRadius: 12,
						padding: 16,
						minWidth: 0,
						width: '100%'
					}}
				>
					<Outlet />
				</div>
			)}
		</div>
	)
}
