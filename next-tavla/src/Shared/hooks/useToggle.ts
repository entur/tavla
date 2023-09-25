import { useState } from 'react'

function useToggle() {
    const [isEnabled, setIsEnabled] = useState(false)

    const open = () => setIsEnabled(true)

    const close = () => setIsEnabled(false)

    return [isEnabled, open, close] as const
}

export { useToggle }
