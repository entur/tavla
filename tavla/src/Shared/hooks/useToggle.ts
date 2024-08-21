import { useState } from 'react'

function useToggle() {
    const [isEnabled, setIsEnabled] = useState(false)

    const enable = () => setIsEnabled(true)

    const disable = () => setIsEnabled(false)

    return [isEnabled, enable, disable] as const
}

export { useToggle }
