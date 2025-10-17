import { Preloader } from '@/components/preloader/Preloader'

import { selectMenuItems } from '@/store/api/accessApi'

import { useAppSelector } from '@/hooks/redux'

import styles from './MainMenu.module.scss'

export const MainMenu = () => {
	const {
		data: menuItems,
		isLoading,
		isError,
		error
	} = useAppSelector(selectMenuItems)

	if (isError) {
		console.log(error)
	}

	if (isLoading) return <Preloader />
	if (isError) return <div>Ошибка загрузки меню</div>
	if (!menuItems?.length) return <div>У вас нет доступа ни к одному пункту</div>

	return (
		<div className={styles.menuContainer}>
			{menuItems.map(item => (
				<div key={item.id} className={styles.menuItem}>
					<div className={styles.cardImage}>
						<img src={item.image} alt='Изображение' />
					</div>
					<span className={styles.cardInfo}>
						<div className={styles.cardTitel}>{item.title}</div>
						<div className={styles.actionWrap}>Перейти в раздел →</div>
					</span>
				</div>
			))}
		</div>
	)
}
