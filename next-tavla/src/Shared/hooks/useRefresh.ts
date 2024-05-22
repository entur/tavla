import { delay } from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import { TMessage } from 'types/refresh'
import { TBoard } from 'types/settings'

function useRefresh(initialBoard: TBoard) {
    const [board, setBoard] = useState<TBoard>(initialBoard)

    const subscribe = useCallback(async () => {
        try {
            const res = await fetch(
                `https://tavla-api.dev.entur.no/subscribe/${initialBoard.id}`,
            )
            if (!res.ok) return delay(subscribe, 10000)

            const message = (await res.json()) as TMessage

            switch (message.type) {
                case 'refresh': {
                    setBoard(message.payload)
                    subscribe()
                    break
                }
                case 'update': {
                    window.location.reload()
                    break
                }
                case 'timeout': {
                    subscribe()
                    break
                }
            }
        } catch {
            delay(subscribe, 10000)
        }
    }, [initialBoard.id])

    useEffect(() => {
        const timeout = setTimeout(subscribe, 10000)
        return () => {
            clearTimeout(timeout)
        }
    }, [subscribe])

    return board
}

export { useRefresh }
