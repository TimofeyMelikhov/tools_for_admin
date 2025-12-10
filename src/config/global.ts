declare var window: Window & {
	_app?: { backendID: string; baseServerPath: string }
}

export const backendId = window._app?.backendID || '7172149230755118139'
export const baseServerPath =
	window?._app?.baseServerPath || 'https://webtutor.stdp.ru/'
// https://webtutor.stdp.ru/
// https://std-wt03.stdp.ru/
export const BACKEND_URL = `${baseServerPath}/custom_web_template.html?object_id=${backendId}`
