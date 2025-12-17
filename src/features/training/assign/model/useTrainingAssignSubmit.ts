import { enqueueSnackbar } from 'notistack'

import { useAssignTrainingMutation } from '../api/trainingAssignApi'

import type { TrainingAssignState } from './types'

export const useTrainingAssignSubmit = () => {
	const [assignTraining, state] = useAssignTrainingMutation()

	const submit = async (
		params: TrainingAssignState,
		onSuccess?: () => void
	) => {
		const { currentObj, excelObj, selectedAction, time } = params

		try {
			const res = await assignTraining({
				currentObj,
				excelObj,
				selectedAction,
				time
			}).unwrap()

			const hasErrors =
				(res.notFoundPersons?.length ?? 0) > 0 ||
				(res.dublicatePersons?.length ?? 0) > 0 ||
				(res.prevAssign?.length ?? 0) > 0

			if (hasErrors) {
				enqueueSnackbar(
					`Обработано ${res.counterPersons} из ${excelObj.length} записей. Есть ошибки.`,
					{ variant: 'warning', style: { fontSize: '14px' } }
				)
			} else {
				enqueueSnackbar('Все записи успешно обработаны!', {
					variant: 'success',
					style: { fontSize: '14px' }
				})
				onSuccess?.()
			}

			return res
		} catch (error) {
			enqueueSnackbar('Произошла ошибка, попробуйте позже', {
				variant: 'error',
				style: { fontSize: '14px' }
			})
			console.error('Ошибка при загрузке на сервер:', error)
			throw error
		}
	}

	return { submit, ...state }
}
