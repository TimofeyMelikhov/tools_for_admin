import { Outlet, useLocation } from 'react-router-dom'

import { GoBack } from '@/components/goBack/GoBack'

import styles from './layout.module.scss'

export const Layout = () => {
	const { pathname } = useLocation()
	const isHomePage = pathname !== '/'
	return (
		<div className={styles.container}>
			{isHomePage && <GoBack />}
			<Outlet />
		</div>
	)
}
