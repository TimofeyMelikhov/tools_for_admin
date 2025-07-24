import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import { CssBaseline } from '@mui/material'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles'

import { store } from '@/store/index.ts'

import theme from './lib/theme.ts'

import { App } from './App.tsx'
import '@/style/global.scss'

createRoot(document.getElementById('root')!).render(
	<Provider store={store}>
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<App />
			</ThemeProvider>
		</StyledEngineProvider>
	</Provider>
)
