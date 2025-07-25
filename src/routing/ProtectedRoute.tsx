// src/routing/ProtectedRoute.tsx
import { type JSX, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useSnackbar } from 'notistack'

import { Preloader } from '@/components/preloader/Preloader'

import { useGetAccessMenuQuery } from '@/store/api/accessApi'

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
	const { enqueueSnackbar } = useSnackbar()
	const location = useLocation()
	const navigate = useNavigate()
	const { data: menuItems, isLoading, isError } = useGetAccessMenuQuery()

	const hasAccess =
		Boolean(menuItems) &&
		menuItems?.some(item => item.route === location.pathname)

	useEffect(() => {
		if (isLoading) {
			return
		}

		if (isError) {
			enqueueSnackbar('Ошибка проверки доступа', {
				variant: 'error',
				style: {
					fontSize: '14px'
				}
			})
			navigate('/', { replace: true })
			return
		}

		if (!hasAccess) {
			enqueueSnackbar('Доступ запрещён', {
				variant: 'error',
				style: {
					fontSize: '14px'
				}
			})
			navigate('/', { replace: true })
		}
	}, [isLoading, isError, hasAccess, enqueueSnackbar, navigate])

	if (isLoading) {
		return <Preloader />
	}

	if (isError || !hasAccess) {
		return null
	}

	return children
}
