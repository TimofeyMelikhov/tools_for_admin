import { Outlet, useLocation } from 'react-router-dom'

import { GoBack } from '@/shared/ui/goBack'

import styles from './layout.module.scss'

export const AppLayout = () => {
	const { pathname } = useLocation()
	const isHomePage = pathname !== '/'

	return (
		<div className={styles.container}>
			{isHomePage && <GoBack />}
			<Outlet />
		</div>
	)
}
