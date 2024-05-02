import { useCallback, useEffect, useRef, useState } from 'react'
import { TBoard } from 'types/settings'

function useRefresh(initialBoard: TBoard) {
    const timeout = useRef<NodeJS.Timeout>()
    const [board, setBoard] = useState<TBoard>(initialBoard)
    const connection = useRef<WebSocket | null>(null)

    const subscribe = useCallback(() => {
        const socket = new WebSocket(
            `ws://localhost:3001/subscribe/${initialBoard.id}`,
        )

        socket.addEventListener('open', () => {
            socket.send(
                `Connection with client on board with id ${initialBoard.id} established`,
            )
        })

        socket.addEventListener('message', (event) => {
            const newBoard = JSON.parse(event.data) as TBoard
            setBoard(newBoard)
        })

        socket.addEventListener(
            'error',
            () => (timeout.current = setTimeout(subscribe, 10000)),
        )

        connection.current = socket
    }, [initialBoard.id])

    useEffect(() => {
        timeout.current = setTimeout(subscribe, 10000)
        return () => {
            connection.current?.close()
            clearTimeout(timeout.current)
        }
    }, [subscribe])

    return board
}

export { useRefresh }
