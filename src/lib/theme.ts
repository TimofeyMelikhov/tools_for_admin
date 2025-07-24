// src/theme.ts
import type { Components, ThemeOptions } from '@mui/material'
import { createTheme } from '@mui/material/styles'

const components: Components<Omit<ThemeOptions, 'components'>> = {
	// 1) Глобальный reset
	MuiCssBaseline: {
		styleOverrides: {
			'*, *::before, *::after': {
				boxSizing: 'border-box',
				margin: 0,
				padding: 0
			},
			html: {
				width: '100%',
				height: '100%',
				fontSize: '16px'
			},
			body: {
				width: '100%',
				height: '100%',
				fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
				backgroundColor: '#fff',
				color: 'rgba(0, 0, 0, 0.87)',
				fontSize: '16px'
			},
			'input[type=text], input[type=number], input[type=password], textarea': {
				all: 'unset',
				boxSizing: 'border-box',
				fontFamily: 'inherit',
				fontSize: 'inherit',
				color: 'inherit'
			}
		}
	},

	// 2) Кнопки
	MuiButton: {
		styleOverrides: {
			root: {
				'&&': {
					fontSize: '16px',
					textTransform: 'none',
					borderRadius: '8px',
					padding: '5px 16px',
					fontWeight: 500
				}
			}
		}
	},

	// 5) Typography
	MuiTypography: {
		styleOverrides: {
			root: {
				'&&': {
					color: 'rgba(0, 0, 0, 0.87)'
				}
			}
		}
	},

	// 6) Snackbar
	MuiSnackbar: {
		styleOverrides: {
			anchorOriginTopCenter: {
				top: '24px'
			}
		}
	},
	MuiSnackbarContent: {
		styleOverrides: {
			root: {
				'&&': {
					backgroundColor: '#323232',
					color: '#fff',
					fontSize: '26px'
				}
			}
		}
	}
}

const theme = createTheme({
	palette: {
		primary: { main: '#1976d2' },
		secondary: { main: '#dc004e' }
	},
	typography: {
		fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
		fontSize: 16 // px-based
	},
	components
})

export default theme
