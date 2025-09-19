'use client'

import { Footer } from '../(admin)/components/Footer'
import { useCompactMode } from './CompactModeProvider'

export function ConditionalFooter({ loggedIn }: { loggedIn: boolean }) {
    const compactMode = useCompactMode()

    if (compactMode) {
        return null
    }

    return <Footer loggedIn={loggedIn} />
}
