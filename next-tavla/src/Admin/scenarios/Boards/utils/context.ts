import { TBoards } from 'Admin/types/boards'
import { Action } from './reducer'
import { useNonNullContext } from 'hooks/useNonNullContext'
import { Dispatch, createContext } from 'react'

export const SettingsDispatchContext = createContext<
    Dispatch<Action> | undefined
>(undefined)

export const SettingsContext = createContext<TBoards | undefined>(undefined)

export function useBoardsSettingsDispatch() {
    return useNonNullContext(SettingsDispatchContext)
}

export function useBoardsSettings() {
    return useNonNullContext(SettingsContext)
}
