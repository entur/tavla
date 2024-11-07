'use client'
import { ReactNode, useEffect, useState } from 'react'

/**
 * Some components from the design system are not made for SSR and need to render only on the client.
 * This is because they rely on client-side JavaScript to work properly.
 *
 * Wrap the component in this component to ensure it only renders on the client.
 */
function ClientOnly({ children }: { children: ReactNode }) {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null
    }

    return <>{children}</>
}

export default ClientOnly
