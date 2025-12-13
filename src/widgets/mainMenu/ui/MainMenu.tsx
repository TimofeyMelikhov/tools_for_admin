import { useGetAccessMenuQuery } from '@/features/access/menu'

import { Preloader } from '@/shared/ui/preloader'

import styles from './MainMenu.module.scss'
import { MenuItem } from './MenuItem'

export const MainMenu = () => {
	const { data: menuItems, isLoading, isError } = useGetAccessMenuQuery()

	if (isLoading) return <Preloader />
	if (isError) return <div>Ошибка загрузки меню</div>
	if (!menuItems?.length) return <div>У вас нет доступа ни к одному пункту</div>

	return (
		<div className={styles.menuContainer}>
			{menuItems.map(item => (
				<MenuItem key={item.id} item={item} />
			))}
		</div>
	)
}
