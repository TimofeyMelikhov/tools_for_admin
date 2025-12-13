import { useNavigate } from 'react-router-dom'

import { ActionCard } from '@/shared/ui/ActionCard'

import { mentorManagementActions } from '../model/actions'

export function MentorsActionChooser() {
	const navigate = useNavigate()

	return (
		<div style={{ display: 'grid', gap: 12 }}>
			<div style={{ color: '#444' }}>Выберите действие:</div>

			<div
				style={{
					display: 'grid',
					gap: 12,
					gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))'
				}}
			>
				{mentorManagementActions.map(a => (
					<ActionCard
						key={a.to}
						title={a.title}
						description={a.description}
						onClick={() => navigate(a.to)}
					/>
				))}
			</div>
		</div>
	)
}
