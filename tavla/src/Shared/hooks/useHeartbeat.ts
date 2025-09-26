import { useEffect, useRef } from 'react'
import { TBoard } from 'types/settings'
import { v4 as uuidv4 } from 'uuid'

// Denne filen har en error: ./src/Shared/hooks/useHeartbeat.ts 36:17  Warning: Unexpected console statement.  no-console

export function useHeartbeat(board: TBoard) {
    const tabIdRef = useRef<string | null>(null)

    useEffect(() => {
        if (typeof window !== 'undefined' && tabIdRef.current === null) {
            let existing = sessionStorage.getItem('tabId')
            if (!existing) {
                existing = uuidv4()
                sessionStorage.setItem('tabId', existing)
            }
            tabIdRef.current = existing
        }
    }, [])

    useEffect(() => {
        if (!board) return
        if (!tabIdRef.current) return

        const boardId = board.id

        const sendHeartbeat = async () => {
            try {
                await fetch('/api/heartbeat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        tid: tabIdRef.current,
                        boardId,
                    }),
                })
            } catch (err) {
                console.error('Error sending heartbeat:', err)
            }
        }

        sendHeartbeat()
        const interval = setInterval(sendHeartbeat, 30_000)

        return () => clearInterval(interval)
    }, [board])
}
