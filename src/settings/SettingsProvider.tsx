import React, { createContext, useContext } from 'react'
import { Settings, useFirebaseSettings } from './useFirebaseSettings'

type SettingsSetter = (settings: Partial<Settings>) => void

const SettingsContext = createContext<[Settings | null, SettingsSetter]>([
    null,
    (): void => undefined,
])

const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [firebaseSettings, setFirebaseSettings] = useFirebaseSettings()

    return (
        <SettingsContext.Provider
            value={[firebaseSettings, setFirebaseSettings]}
        >
            {children}
        </SettingsContext.Provider>
    )
}

function useSettings(): [Settings | null, SettingsSetter] {
    return useContext(SettingsContext)
}

export type { SettingsSetter }
export { useSettings, SettingsProvider }
