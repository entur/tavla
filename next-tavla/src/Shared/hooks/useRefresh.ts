import { useEffect, useRef, useState } from 'react'
import { TBoard } from 'types/settings'

function useRefresh(initialBoard: TBoard) {
    const [board, setBoard] = useState<TBoard>(initialBoard)
    const connection = useRef<WebSocket | null>(null)

    useEffect(() => {
        const t = setTimeout(() => {
            const socket = new WebSocket(
                `ws://localhost:3001/subscribe/${initialBoard.id}`,
            )

            socket.addEventListener('open', () => {
                console.log('established connection to websocket server')
                socket.send(
                    `Connection with client on board with id ${initialBoard.id} established`,
                )
            })

            socket.addEventListener('message', (event) => {
                console.log('Data from server', event)
                const newBoard = JSON.parse(event.data) as TBoard
                setBoard(newBoard)
            })

            connection.current = socket
        }, 10000)
        return () => {
            connection.current?.close()
            clearTimeout(t)
        }
    }, [initialBoard])

    return board
}

export { useRefresh }
