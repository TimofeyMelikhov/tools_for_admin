declare var window: Window & {
	_app?: { backendID: string; baseServerPath: string }
}

export const backendId = window._app?.backendID || '7173294982396868004'
export const baseServerPath =
	window?._app?.baseServerPath || 'https://webtutor.stdp.ru:33091/'
export const BACKEND_URL = `${baseServerPath}/custom_web_template.html?object_id=${backendId}`
