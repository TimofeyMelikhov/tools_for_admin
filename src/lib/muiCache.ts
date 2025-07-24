// src/createEmotionCache.ts
import createCache, { type EmotionCache } from '@emotion/cache'

export default function createEmotionCache(): EmotionCache {
	let insertionPoint: HTMLElement | undefined

	if (typeof document !== 'undefined') {
		// Ищем <meta name="emotion-insertion-point"> внутри <head>
		const meta = document.head.querySelector<HTMLMetaElement>(
			'meta[name="emotion-insertion-point"]'
		)
		if (meta) {
			insertionPoint = meta
		}
	}

	return createCache({
		key: 'mui', // префикс для классов MUI
		insertionPoint // теперь точно HTMLElement | undefined
	})
}
