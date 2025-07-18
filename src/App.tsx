import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import { CssBaseline, ThemeProvider } from '@mui/material'
import { SnackbarProvider } from 'notistack'

import { useGetAccessMenuQuery } from './store/api/accessApi'

import { theme } from './lib/theme'

import { type RouteConfig, routesConfig } from './routing/routesConfig'

export const App = () => {
	useGetAccessMenuQuery()
	const mapRoutes = (routes: RouteConfig[]): RouteConfig[] =>
		routes.map(({ element, children, ...rest }) => ({
			...rest,
			element,
			children: children ? mapRoutes(children) : undefined
		}))

	const router = createBrowserRouter(mapRoutes(routesConfig), {
		basename: '/_wt/adminTool'
	})

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<SnackbarProvider maxSnack={3}>
				<RouterProvider router={router} />
			</SnackbarProvider>
		</ThemeProvider>
	)
}
