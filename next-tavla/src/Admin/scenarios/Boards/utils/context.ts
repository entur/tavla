import { BoardsSettings } from 'Admin/types/boards'
import { Action } from './reducer'
import { useNonNullContext } from 'hooks/useNonNullContext'
import { Dispatch, createContext, useCallback } from 'react'
import { TavlaError } from 'Admin/types/error'
import { TBoard } from 'types/settings'
import { useToast } from '@entur/alert'

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

    return useCallback(
        async (
            action: Action,
            url: string,
            payload: object,
            fetchSettings?: RequestInit,
        ) => {
            if (!dispatch || !boardsSettings) return

            dispatch(action)
            const rollback = () =>
                dispatch({ type: 'setSettings', payload: boardsSettings })

            await fetch(url, {
                ...fetchSettings,
                body: JSON.stringify(payload),
            })
                .then((response) => {
                    if (response.ok) return
                    rollback()
                    throw new TavlaError({
                        code: 'BOARD',
                        message: `Error updating board: ${response.status} ${response.statusText}`,
                    })
                })
                .catch((error) => {
                    rollback()
                    throw new TavlaError({
                        code: 'BOARD',
                        message: `Error updating board: ${error}`,
                    })
                })
        },
        [boardsSettings, dispatch],
    )
}

export function useOptimisticDeleteBoard() {
    const optimisticDispatch = useOptimisticBoardsSettingsDispatch()
    const { addToast } = useToast()

    return useCallback(
        async (board: TBoard) => {
            try {
                if (!board.id) {
                    throw new TavlaError({
                        code: 'BOARD',
                        message: 'Error deleting board: board.id not found',
                    })
                }
                await optimisticDispatch(
                    { type: 'deleteBoard', bid: board.id },
                    '/api/board',
                    { bid: board.id },
                    {
                        method: 'DELETE',
                    },
                )
                addToast({
                    title: 'Tavle slettet!',
                    content: `${board?.meta?.title ?? 'Tavla'} er slettet!`,
                    variant: 'info',
                })
            } catch (error) {
                addToast({
                    title: 'Noe gikk galt',
                    content: 'Kunne ikke slette tavle',
                    variant: 'info',
                })
            }
        },
        [optimisticDispatch, addToast],
    )
}

export function useOptimisticSetBoard() {
    const optimisticDispatch = useOptimisticBoardsSettingsDispatch()
    const { addToast } = useToast()

    return useCallback(
        async (board: TBoard) => {
            try {
                if (!board.id) {
                    throw new TavlaError({
                        code: 'BOARD',
                        message: 'Error deleting board: board.id not found',
                    })
                }
                await optimisticDispatch(
                    { type: 'setBoard', board },
                    '/api/board',
                    { board },
                    {
                        method: 'PUT',
                    },
                )
                addToast({
                    title: 'Tavle oppdatert!',
                    content: `${board?.meta?.title ?? 'Tavla'} er oppdatert`,
                    variant: 'info',
                })
            } catch (error) {
                addToast({
                    title: 'Noe gikk galt',
                    content: 'Kunne ikke oppdatere tavle',
                    variant: 'info',
                })
            }
        },
        [optimisticDispatch, addToast],
    )
}
