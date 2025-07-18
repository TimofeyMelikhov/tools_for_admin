// src/theme.ts
import { createTheme } from '@mui/material'

export const theme = createTheme({
	typography: {
		// базовый размер шрифта: 16px
		fontSize: 16,
		// размер шрифта для кнопок
		button: {
			textTransform: 'none',
			fontSize: '16px'
		}
	},
	components: {
		// 1. Кнопки MUI
		MuiButton: {
			styleOverrides: {
				root: {
					fontSize: '16px',
					textTransform: 'none'
				}
			}
		},

		// 2. Outlined TextField: ввод и лейбл
		MuiOutlinedInput: {
			styleOverrides: {
				// сам текст внутри input
				input: {
					fontSize: '16px',
					// убираем нативный outline при фокусе
					'&:focus': {
						outline: 'none'
					}
				},
				// конкретно для size="small"
				sizeSmall: {
					'& .MuiOutlinedInput-input': {
						fontSize: '16px',
						padding: '8px 12px'
					}
				},
				// бордер fieldset – оставляем тонкий серый или убираем
				notchedOutline: {
					border: '1px solid rgba(0, 0, 0, 0.23)'
				}
			}
		},
		MuiInputLabel: {
			styleOverrides: {
				root: {
					fontSize: '16px'
				},
				sizeSmall: {
					fontSize: '16px'
				}
			}
		},

		// 3. enqueueSnackbar / notistack
		MuiSnackbarContent: {
			styleOverrides: {
				root: {
					fontSize: '16px',
					'& .MuiSnackbarContent-message': {
						fontSize: '16px'
					}
				}
			}
		}
	}
})
