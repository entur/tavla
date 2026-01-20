'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

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
