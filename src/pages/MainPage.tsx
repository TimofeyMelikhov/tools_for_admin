import type { ReactElement } from 'react'

import { Container, Typography } from '@mui/material'
import { SnackbarProvider } from 'notistack'

import ExcelUploader from '@/components/ExcelUploader'

export const MainPage = (): ReactElement => {
	return (
		<SnackbarProvider maxSnack={2}>
			<Container maxWidth='sm' sx={{ mt: 4 }}>
				<Typography variant='h5' gutterBottom>
					Импорт Excel в JSON
				</Typography>
				<ExcelUploader />
			</Container>
		</SnackbarProvider>
	)
}
