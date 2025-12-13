import { createBrowserRouter } from 'react-router-dom'

import { type RouteConfig, routesConfig } from './routes'

const mapRoutes = (routes: RouteConfig[]): RouteConfig[] =>
	routes.map(({ element, children, ...rest }) => ({
		...rest,
		element,
		children: children ? mapRoutes(children) : undefined
	}))

export const router = createBrowserRouter(mapRoutes(routesConfig), {
	basename: '/_wt/adminTool'
})
