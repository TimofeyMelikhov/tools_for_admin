import { type JSX, useEffect, useMemo } from 'react'

import { useLocation, useNavigate } from 'react-router-dom'

import { useSnackbar } from 'notistack'

import { useAccessMenu } from '@/features/access/menu'

import { Preloader } from '@/shared/ui/preloader'

type MenuItem = {
	route: string
}

const normalizePath = (path: string) => {
	const clean = path.split('?')[0].split('#')[0]
	if (clean === '/') return '/'
	return clean.replace(/\/+$/, '')
}

const withTrailingSlash = (path: string) => (path === '/' ? '/' : `${path}/`)

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
	const { enqueueSnackbar } = useSnackbar()
	const location = useLocation()
	const navigate = useNavigate()
	const { data: menuItems, isLoading, isError } = useAccessMenu()

	const hasAccess = useMemo(() => {
		if (!menuItems) return false

		const current = normalizePath(location.pathname)
		const currentWithSlash = withTrailingSlash(current)

		return (menuItems as MenuItem[]).some(item => {
			const allowed = normalizePath(item.route)
			const allowedWithSlash = withTrailingSlash(allowed)

			if (current === allowed) return true

			return currentWithSlash.startsWith(allowedWithSlash)
		})
	}, [menuItems, location.pathname])

	useEffect(() => {
		if (isLoading) return

		if (isError) {
			enqueueSnackbar('Ошибка проверки доступа', {
				variant: 'error',
				style: { fontSize: '14px' }
			})
			navigate('/', { replace: true })
			return
		}

		if (!hasAccess) {
			enqueueSnackbar('Доступ запрещён', {
				variant: 'error',
				style: { fontSize: '14px' }
			})
			navigate('/', { replace: true })
		}
	}, [isLoading, isError, hasAccess, enqueueSnackbar, navigate])

	if (isLoading) return <Preloader />
	if (isError || !hasAccess) return null

	return children
}
