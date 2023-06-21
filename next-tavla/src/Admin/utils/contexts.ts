import { Action } from 'Admin/scenarios/Edit/reducer'
import { useNonNullContext } from 'hooks/useNonNullContext'
import { Dispatch, createContext } from 'react'

export const SettingsDispatchContext = createContext<
    Dispatch<Action> | undefined
>(undefined)

export function useSettingsDispatch() {
    return useNonNullContext(SettingsDispatchContext)
}
