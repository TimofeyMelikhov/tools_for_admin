import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import { SnackbarProvider } from 'notistack'

import { useGetAccessMenuQuery } from './store/api/accessApi'

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
		<SnackbarProvider maxSnack={3}>
			<RouterProvider router={router} />
		</SnackbarProvider>
	)
}
