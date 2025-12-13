import { createRoot } from 'react-dom/client'

import { AppProviders } from '@/app/providers/AppProviders'

import '@/style/global.scss'

createRoot(document.getElementById('root')!).render(<AppProviders />)
