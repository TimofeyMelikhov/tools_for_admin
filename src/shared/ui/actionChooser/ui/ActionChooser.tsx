import { useNavigate } from 'react-router-dom'

import { ActionCard } from '@/shared/ui/ActionCard'

import type { ActionNavItem } from '../model/types'

type Props = {
	items: ActionNavItem[]
	title?: string
	columnsMinWidth?: number
}

export const ActionChooser = ({
	items,
	title = 'Выберите действие:',
	columnsMinWidth = 260
}: Props) => {
	const navigate = useNavigate()

	return (
		<div style={{ display: 'grid', gap: 12 }}>
			<div style={{ color: '#444' }}>{title}</div>

			<div
				style={{
					display: 'grid',
					gap: 12,
					gridTemplateColumns: `repeat(auto-fit, minmax(${columnsMinWidth}px, 1fr))`
				}}
			>
				{items.map(a => (
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
