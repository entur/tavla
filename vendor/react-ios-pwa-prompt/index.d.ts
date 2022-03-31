import type { FC } from 'react'

declare const PWAPrompt: FC<{
    debug: boolean
    copyTitle: string
    copyShareButtonLabel: string
    copyAddHomeButtonLabel: string
    copyClosePrompt: string
    onClose: () => void
}>

export default PWAPrompt
