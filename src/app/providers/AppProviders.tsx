import { RouterProvider } from 'react-router-dom'

import { ScopedCssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { SnackbarProvider } from 'notistack'

import { router } from '@/app/router/router'

import theme from '@/shared/lib/theme'

import { QueryProvider } from './QueryProvider'

export const AppProviders = () => {
	return (
		<QueryProvider>
			<ThemeProvider theme={theme}>
				<ScopedCssBaseline className="admin-tool-root">
					<SnackbarProvider maxSnack={3}>
						<RouterProvider router={router} />
					</SnackbarProvider>
				</ScopedCssBaseline>
			</ThemeProvider>
		</QueryProvider>
	)
}
