import { RouterProvider } from 'react-router-dom'

import { CssBaseline } from '@mui/material'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import { SnackbarProvider } from 'notistack'
import { Provider } from 'react-redux'

import { router } from '@/app/router/router'
import { store } from '@/app/store'

import theme from '@/shared/lib/theme'

export const AppProviders = () => {
	return (
		<Provider store={store}>
			<StyledEngineProvider injectFirst>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<SnackbarProvider maxSnack={3}>
						<RouterProvider router={router} />
					</SnackbarProvider>
				</ThemeProvider>
			</StyledEngineProvider>
		</Provider>
	)
}
