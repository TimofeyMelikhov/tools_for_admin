import { Box, Button } from '@mui/material'

type Props = {
	isVisible: boolean
	isLoading: boolean
	buttonText: string
	onClick: () => void
}

export const SubmitSection = ({
	isVisible,
	isLoading,
	buttonText,
	onClick
}: Props) => {
	if (!isVisible) return null

	return (
		<Box sx={{ display: 'flex' }}>
			<Button
				variant='contained'
				component='span'
				onClick={onClick}
				sx={{ mt: 2, mb: 2, ml: 'auto', fontSize: '14px' }}
				disabled={isLoading}
			>
				{buttonText}
			</Button>
		</Box>
	)
}
