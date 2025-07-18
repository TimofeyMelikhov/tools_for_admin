import { Outlet } from 'react-router-dom'

import { Breadcrumbs } from '@/components/breadcrumbs/Breadcrumbs'

export const Layout = () => {
	return (
		<div>
			<Breadcrumbs />
			<Outlet />
		</div>
	)
}
