import { type ReactElement } from 'react'

import { Typography } from '@mui/material'

import { MainMenu } from '@/components/mainMenu/MainMenu'

import styles from './MainPage.module.scss'

export const MainPage = (): ReactElement => {
	return (
		<div className={styles.container}>
			<Typography variant='h2' gutterBottom align='center'>
				Инструменты администратора
			</Typography>
			<MainMenu />
		</div>
	)
}
