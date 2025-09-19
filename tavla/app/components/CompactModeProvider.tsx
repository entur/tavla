'use client'

import { useSearchParams } from 'next/navigation'
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react'

const CompactModeContext = createContext<boolean>(false)

export function useCompactMode() {
    return useContext(CompactModeContext)
}

export function CompactModeProvider({ children }: { children: ReactNode }) {
    const searchParams = useSearchParams()
    const [compactMode, setCompactMode] = useState(false)

    useEffect(() => {
        const compact = searchParams?.get('compact') === 'true'
        setCompactMode(compact)
    }, [searchParams])

    return (
        <CompactModeContext.Provider value={compactMode}>
            {children}
        </CompactModeContext.Provider>
    )
}
