import React, { useContext } from 'react'

export const LongPressContext = React.createContext<boolean>(false)

export const LongPressProvider = LongPressContext.Provider

export function useIsLongPressed(): boolean {
    return useContext(LongPressContext)
}
