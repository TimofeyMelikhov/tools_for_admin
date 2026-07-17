import { RouterProvider } from 'react-router-dom'

import { CssBaseline } from '@mui/material'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import { SnackbarProvider } from 'notistack'

import { router } from '@/app/router/router'

import theme from '@/shared/lib/theme'

import { QueryProvider } from './QueryProvider'

export const AppProviders = () => {
	return (
		<QueryProvider>
			<StyledEngineProvider injectFirst>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<SnackbarProvider maxSnack={3}>
						<RouterProvider router={router} />
					</SnackbarProvider>
				</ThemeProvider>
			</StyledEngineProvider>
		</QueryProvider>
	)
}
