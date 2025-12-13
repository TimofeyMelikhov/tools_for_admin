import type { ActionCardProps } from './ActionCard.types'

export const ActionCard = ({
	title,
	description,
	onClick,
	disabled = false
}: ActionCardProps) => {
	return (
		<button
			type='button'
			onClick={onClick}
			disabled={disabled}
			style={{
				textAlign: 'left',
				padding: 16,
				borderRadius: 12,
				border: '1px solid #eaeaea',
				background: '#fff',
				cursor: disabled ? 'not-allowed' : 'pointer',
				display: 'grid',
				gap: 6,
				opacity: disabled ? 0.6 : 1
			}}
		>
			<div style={{ fontSize: 16, fontWeight: 600 }}>{title}</div>

			{description ? (
				<div style={{ fontSize: 13, color: '#666' }}>{description}</div>
			) : null}
		</button>
	)
}
