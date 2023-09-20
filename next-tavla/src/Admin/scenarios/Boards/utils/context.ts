import { Action, TBoards } from './reducer'
import { useNonNullContext } from 'hooks/useNonNullContext'
import { Dispatch, createContext } from 'react'

export const SettingsDispatchContext = createContext<
    Dispatch<Action> | undefined
>(undefined)

export const SettingsContext = createContext<TBoards | undefined>(undefined)

export function useSettingsDispatch() {
    return useNonNullContext(SettingsDispatchContext)
}

export function useSettings() {
    return useNonNullContext(SettingsContext)
}
