'use client'

import { Navbar } from '../(admin)/components/Navbar'
import { useCompactMode } from './CompactModeProvider'

export function ConditionalNavbar({ loggedIn }: { loggedIn: boolean }) {
    const compactMode = useCompactMode()

    if (compactMode) {
        return null
    }

    return <Navbar loggedIn={loggedIn} />
}
