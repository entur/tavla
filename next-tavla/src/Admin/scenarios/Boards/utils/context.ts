import { BoardsSettings } from 'Admin/types/boards'
import { Action } from './reducer'
import { useNonNullContext } from 'hooks/useNonNullContext'
import { Dispatch, createContext, useCallback } from 'react'
import { TavlaError } from 'Admin/types/error'

export const SettingsDispatchContext = createContext<
    Dispatch<Action> | undefined
>(undefined)

export const SettingsContext = createContext<BoardsSettings | undefined>(
    undefined,
)

export function useBoardsSettingsDispatch() {
    return useNonNullContext(SettingsDispatchContext)
}

export function useBoardsSettings() {
    return useNonNullContext(SettingsContext)
}

export function useOptimisticBoardsSettingsDispatch() {
    const dispatch = useBoardsSettingsDispatch()
    const boardsSettings = useBoardsSettings()

    const callBack = useCallback(
        async (
            action: Action,
            url: string,
            payload: object,
            fetchSettings?: RequestInit,
        ) => {
            if (!dispatch || !boardsSettings) return
            dispatch(action)
            await fetch(url, {
                ...fetchSettings,
                body: JSON.stringify(payload),
            }).then((response) => {
                if (response.ok) return
                dispatch({ type: 'rollback', payload: boardsSettings })
                throw new TavlaError({
                    code: 'BOARD',
                    message: `Error updating board: ${response.status} ${response.statusText}`,
                })
            })
        },
        [boardsSettings, dispatch],
    )

    return callBack
}
