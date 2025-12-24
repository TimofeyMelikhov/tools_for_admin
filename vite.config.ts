import react from '@vitejs/plugin-react'
import path from 'path'
import { type ConfigEnv, defineConfig } from 'vite'

// https://vite.dev/config/
export default ({ command }: ConfigEnv) => {
	const isDev = command === 'serve'
	return defineConfig({
		plugins: [react()],
		base: isDev ? '/_wt/adminTool/' : 'tools_for_admin/dist/',
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src')
			}
		}
	})
}
