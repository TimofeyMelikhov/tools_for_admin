export type OptionType = { value: string; label: string }
export const optionsForAction: OptionType[] = [
	{ value: 'addToGroup', label: 'Добавить пользователей' },
	{ value: 'deleteFromGroup', label: 'Удалить пользователей' },
	{ value: 'moveToGroup', label: 'Переместить пользователей' },
	{ value: 'installLeader', label: 'Установить руководителя' }
]

export const operationConfig = {
	addToGroup: {
		method: 'addToGroup' as const,
		successMessage: 'Сотрудники успешно добавлены'
	},
	deleteFromGroup: {
		method: 'deletePersonFromGroup' as const,
		successMessage: 'Сотрудники успешно удалены'
	},
	moveToGroup: {
		method: 'moveToGroup' as const,
		successMessage: 'Сотрудники успешно перемещены'
	},
	installLeader: {
		method: 'installLeader' as const,
		successMessage: 'Руководитель успешно установлен'
	}
}
