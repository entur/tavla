import React, { useContext } from 'react'

const LongPressContext = React.createContext<boolean>(false)

export const LongPressProvider = LongPressContext.Provider

export function useIsLongPressed(): boolean {
    return useContext(LongPressContext)
}
