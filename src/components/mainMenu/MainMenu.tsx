import React from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './MainMenu.module.scss'
import type { MenuItem } from './types'

const menuItems: MenuItem[] = [
	{
		id: 1,
		title: 'Назначение тестов/курсов, добавление в группу',
		route: '/TrainingManagement'
	},
	{ id: 2, title: 'Обновление наград', route: '/notifications' },
	{ id: 3, title: 'Обновление профилей наставников', route: '/support' }
]

const MainMenu: React.FC = () => {
	const navigate = useNavigate()

	const handleClick = (route: string) => {
		// Здесь можно подключить useNavigate() из react-router-dom
		navigate(route)
	}

	return (
		<div className={styles.menuContainer}>
			{menuItems.map(item => (
				<div
					key={item.id}
					className={styles.menuItem}
					onClick={() => handleClick(item.route)}
				>
					{item.title}
				</div>
			))}
		</div>
	)
}

export default MainMenu
