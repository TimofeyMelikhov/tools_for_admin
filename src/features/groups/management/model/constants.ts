import type { ActionOption, GroupAction } from './types'

export const optionsForAction: ActionOption[] = [
	{ value: 'addToGroup', label: 'Добавить пользователей' },
	{ value: 'deleteFromGroup', label: 'Удалить пользователей' },
	{ value: 'moveToGroup', label: 'Переместить пользователей' },
	{ value: 'installLeader', label: 'Установить руководителя' }
]

export const operationConfig: Record<
	GroupAction,
	{
		method:
			| 'addToGroup'
			| 'deletePersonFromGroup'
			| 'moveToGroup'
			| 'installLeader'
	}
> = {
	addToGroup: { method: 'addToGroup' },
	deleteFromGroup: { method: 'deletePersonFromGroup' },
	moveToGroup: { method: 'moveToGroup' },
	installLeader: { method: 'installLeader' }
}
