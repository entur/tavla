import { useState } from 'react'

function useToggle() {
    const [isOpen, setIsOpen] = useState(false)

    const open = () => setIsOpen(true)

    const close = () => setIsOpen(false)

    return [isOpen, open, close] as const
}

export { useToggle }
