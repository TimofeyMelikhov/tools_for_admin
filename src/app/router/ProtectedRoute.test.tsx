import { render, screen, waitFor } from '@testing-library/react'
import { SnackbarProvider } from 'notistack'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { useAccessMenu } = vi.hoisted(() => ({ useAccessMenu: vi.fn() }))

vi.mock('@/features/access/menu', () => ({ useAccessMenu }))

import { ProtectedRoute } from './ProtectedRoute'

const renderRoute = (route: string) =>
	render(
		<SnackbarProvider>
			<MemoryRouter initialEntries={[route]}>
				<Routes>
					<Route
						path='/'
						element={<div>Главная страница</div>}
					/>
					<Route
						path='/groupManagement/add'
						element={
							<ProtectedRoute>
								<div>Управление группой</div>
							</ProtectedRoute>
						}
					/>
				</Routes>
			</MemoryRouter>
		</SnackbarProvider>
	)

describe('ProtectedRoute', () => {
	beforeEach(() => useAccessMenu.mockReset())

	it('shows a nested route allowed by the access menu', () => {
		useAccessMenu.mockReturnValue({
			data: [{ route: '/groupManagement' }],
			isLoading: false,
			isError: false
		})

		renderRoute('/groupManagement/add')

		expect(screen.getByText('Управление группой')).toBeInTheDocument()
	})

	it('redirects an unavailable route to the main page', async () => {
		useAccessMenu.mockReturnValue({
			data: [{ route: '/TrainingManagement' }],
			isLoading: false,
			isError: false
		})

		renderRoute('/groupManagement/add')

		await waitFor(() =>
			expect(screen.getByText('Главная страница')).toBeInTheDocument()
		)
	})
})
