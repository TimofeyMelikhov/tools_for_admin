import { type FC } from 'react'

import { Link } from 'react-router-dom'

import type { MenuResponse } from '@/shared/api/types'

import styles from './MenuItem.module.scss'

export const MenuItem: FC<{ item: MenuResponse }> = ({ item }) => {
	return (
		<article
			className={styles.menuItem}
			aria-labelledby={`menu-title-${item.id}`}
		>
			<div className={styles.cardImage}>
				<img src={item.image} alt={item.title || 'Изображение раздела'} />
			</div>

			<div className={styles.cardInfo}>
				<h3 id={`menu-title-${item.id}`} className={styles.title}>
					{item.title}
				</h3>

				<div className={styles.actionWrap}>
					<Link
						to={item.route}
						className={styles.actionButton}
						aria-label={`Перейти в раздел ${item.title}`}
					>
						Перейти в раздел →
					</Link>
				</div>
			</div>
		</article>
	)
}
