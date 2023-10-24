import { useNonNullContext } from 'hooks/useNonNullContext'
import { Dispatch, createContext } from 'react'
import { Action } from './reducer'

export const SettingsDispatchContext = createContext<
    Dispatch<Action> | undefined
>(undefined)

export function useCreateBoardDispatch() {
    return useNonNullContext(SettingsDispatchContext)
}
