import { Typography } from '@mui/material'

import { MainMenu } from '@/widgets/mainMenu'

import styles from './MainPage.module.scss'

export const MainPage = () => {
	return (
		<div className={styles.container}>
			<Typography variant='h2' gutterBottom align='center'>
				Инструменты администратора
			</Typography>
			<MainMenu />
		</div>
	)
}
