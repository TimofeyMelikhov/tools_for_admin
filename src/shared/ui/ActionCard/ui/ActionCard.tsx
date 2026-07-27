import type { ActionCardProps } from '../model/ActionCard.types'

import styles from './ActionCard.module.scss'

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
			className={styles.actionCard}
		>
			<div className={styles.title}>{title}</div>
			{description && <div className={styles.description}>{description}</div>}
		</button>
	)
}
