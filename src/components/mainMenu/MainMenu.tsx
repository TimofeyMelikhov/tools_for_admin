import { Link } from 'react-router-dom'

import { Preloader } from '@/components/preloader/Preloader'

import { selectMenuItems } from '@/store/api/accessApi'

import { useAppSelector } from '@/hooks/redux'

import styles from './MainMenu.module.scss'

export const MainMenu = () => {
	const {
		data: menuItems,
		isLoading,
		isError
	} = useAppSelector(selectMenuItems)

	if (isLoading) return <Preloader />
	if (isError) return <div>Ошибка загрузки меню</div>
	if (!menuItems?.length) return <div>У вас нет доступа ни к одному пункту</div>

	return (
		<div className={styles.menuContainer}>
			{menuItems.map(item => (
				<Link key={item.id} to={item.route}>
					<div className={styles.menuItem}>{item.title}</div>
				</Link>
			))}
		</div>
	)
}
