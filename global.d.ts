export {}

declare global {
	interface Window {
		_app?: {
			backendID?: string
			baseServerPath?: string
			// при необходимости добавьте другие поля
		}
	}
}
