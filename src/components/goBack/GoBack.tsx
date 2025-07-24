import { MdArrowBack } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

import styles from './goBack.module.scss'

export const GoBack = () => {
	const navigate = useNavigate()

	const goBackHandler = () => {
		navigate(-1)
	}

	return (
		<div className={styles.container} onClick={goBackHandler}>
			<MdArrowBack /> <span>Назад</span>
		</div>
	)
}
