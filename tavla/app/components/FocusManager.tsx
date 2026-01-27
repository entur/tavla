'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * FocusManager component for accessibility support during client-side navigation.
 *
 * This component manages focus when users navigate between pages in a Next.js application.
 * It ensures that screen reader users are moved to the top of the new page content,
 * preventing them from being stuck in the middle of the previous page's content.
 *
 * @returns `null` - This component renders nothing
 */

export function FocusManager() {
    const pathname = usePathname()

    useEffect(() => {
        const hadTabIndex = document.body.hasAttribute('tabIndex')

        if (!hadTabIndex) {
            document.body.setAttribute('tabIndex', '-1')
        }

        document.body.focus()

        if (!hadTabIndex) {
            const cleanup = () => {
                document.body.removeAttribute('tabIndex')
                document.body.removeEventListener('blur', cleanup)
            }
            document.body.addEventListener('blur', cleanup)
        }
    }, [pathname])

    return null
}
