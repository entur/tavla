import { cloneElement, ReactElement, useEffect, useState } from 'react'

/*
 *  Some components from the design system are not made for SSR and need to render only on the client.
 *  This is because they rely on client-side JavaScript to work properly.
 *
 *  Wrap the component in this component to ensure it only renders on the client.
 */

function ClientOnlyComponent({
    children,
    ...delegated
}: {
    children: ReactElement
}) {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null
    }

    return cloneElement(children, delegated)
}

export default ClientOnlyComponent
