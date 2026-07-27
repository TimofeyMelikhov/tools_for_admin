// src/theme.ts
import type { Components, ThemeOptions } from '@mui/material'
import { createTheme } from '@mui/material/styles'

const components: Components<Omit<ThemeOptions, 'components'>> = {
	// Кнопки
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

	// Typography
	MuiTypography: {
		styleOverrides: {
			root: {
				'&&': {
					color: 'rgba(0, 0, 0, 0.87)'
				}
			}
		}
	},

	// Snackbar
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
					fontSize: '14px'
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
		fontSize: 16,
		htmlFontSize: 10
	},
	components
})

export default theme
