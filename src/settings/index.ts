import {
    createContext, useContext, useState, useCallback,
} from 'react'
import { LegMode } from '@entur/sdk'

import { persist, restore } from './UrlStorage'

export interface Settings {
    hiddenStations: Array<string>,
    hiddenStops: Array<string>,
    hiddenModes: Array<LegMode>,
    hiddenRoutes: {
        [stopPlaceId: string]: Array<string>,
    },
    distance?: number,
    newStations?: Array<string>,
    newStops?: Array<string>,
}

interface SettingsSetters {
    setHiddenStations: (hiddenStations: Array<string>) => void,
    setHiddenStops: (hiddenStops: Array<string>) => void,
    setHiddenModes: (hiddenModes: Array<LegMode>) => void,
    setHiddenRoutes: (hiddenModes: { [stopPlaceId: string]: Array<string> }) => void,
    setDistance: (distance: number) => void,
    setNewStations: (newStations: Array<string>) => void,
    setNewStops: (newStops: Array<string>) => void,
}

type Persistor = () => void

export const SettingsContext = createContext<[Settings, SettingsSetters, Persistor]>([
    restore(),
    {
        setHiddenStations: (): void => undefined,
        setHiddenStops: (): void => undefined,
        setHiddenModes: (): void => undefined,
        setHiddenRoutes: (): void => undefined,
        setDistance: (): void => undefined,
        setNewStations: (): void => undefined,
        setNewStops: (): void => undefined,
    },
    (): void => console.log('Persistor not set up yet'), // eslint-disable-line no-console
])

export function useSettingsContext(): [Settings, SettingsSetters, Persistor] {
    return useContext(SettingsContext)
}

export function useSettings(): [Settings, SettingsSetters, Persistor] {
    const [settings, setSettings] = useState(restore())

    const persistSettings = useCallback(() => {
        persist(settings)
    }, [settings])

    const set = useCallback(<T>(key: string, value: T): void => {
        setSettings(prevSettings => ({ ...prevSettings, [key]: value }))
    }, [setSettings])

    const setHiddenStations = useCallback((newHiddenStations: Array<string>): void => {
        set('hiddenStations', newHiddenStations)
    }, [set])

    const setHiddenStops = useCallback((newHiddenStops: Array<string>): void => {
        set('hiddenStops', newHiddenStops)
    }, [set])

    const setHiddenModes = useCallback((newHiddenModes: Array<LegMode>): void => {
        set('hiddenModes', newHiddenModes)
    }, [set])

    const setHiddenRoutes = useCallback((newHiddenRoutes: { [stopPlaceId: string]: Array<string> }): void => {
        set('hiddenRoutes', newHiddenRoutes)
    }, [set])

    const setDistance = useCallback((newDistance: number): void => {
        set('distance', newDistance)
    }, [set])

    const setNewStations = useCallback((newStations: Array<string>): void => {
        set('newStations', newStations)
    }, [set])

    const setNewStops = useCallback((newStops: Array<string>): void => {
        set('newStops', newStops)
    }, [set])

    const setters = {
        setHiddenStations,
        setHiddenStops,
        setHiddenModes,
        setHiddenRoutes,
        setDistance,
        setNewStations,
        setNewStops,
    }

    return [settings, setters, persistSettings]
}
