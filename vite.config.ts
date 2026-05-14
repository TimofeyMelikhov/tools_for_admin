import react from '@vitejs/plugin-react'
import path from 'path'
import { type ConfigEnv, defineConfig } from 'vite'

// https://vite.dev/config/
export default ({ command }: ConfigEnv) => {
	const isDev = command === 'serve'
	return defineConfig({
		plugins: [react()],
		base: isDev ? '/_wt/adminTool/' : '/tools_for_admin/dist/',
		build: {
			rollupOptions: {
				output: {
					manualChunks(id) {
						if (!id.includes('node_modules')) return

						if (id.includes('xlsx')) return 'xlsx'
						if (id.includes('react-select')) return 'react-select'
						if (id.includes('@mui/x-data-grid')) return 'mui-data-grid'
						if (id.includes('rsuite')) return 'rsuite'
						if (id.includes('@tanstack/react-table')) return 'react-table'
						if (
							id.includes('@mui/') ||
							id.includes('@emotion/') ||
							id.includes('@popperjs/core') ||
							id.includes('@floating-ui/') ||
							id.includes('react-transition-group') ||
							id.includes('clsx') ||
							id.includes('@babel/runtime')
						) {
							return 'mui'
						}
						if (
							id.includes('@reduxjs/toolkit') ||
							id.includes('react-redux') ||
							id.includes('redux') ||
							id.includes('immer')
						) {
							return 'state'
						}
						if (id.includes('notistack')) return 'notistack'
						if (id.includes('dayjs')) return 'dayjs'
						if (id.includes('react-icons')) return 'icons'

						return 'vendor'
					}
				}
			}
		},
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src')
			}
		}
	})
}
