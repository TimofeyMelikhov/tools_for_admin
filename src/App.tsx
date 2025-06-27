import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import { type RouteConfig, routesConfig } from './lib/routesConfig'

export const App = () => {
	const mapRoutes = (routes: RouteConfig[]): RouteConfig[] =>
		routes.map(({ isProtected, element, children, ...rest }) => ({
			...rest,
			element,
			children: children ? mapRoutes(children) : undefined
		}))

	const router = createBrowserRouter(mapRoutes(routesConfig))

	return <RouterProvider router={router} />
}
