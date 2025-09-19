// hooks/useHeartbeat.ts
import { useEffect, useRef } from 'react'
import { TBoard } from 'types/settings'
import { v4 as uuidv4 } from 'uuid'

export function useHeartbeat(board: TBoard) {
    const tabIdRef = useRef<string | null>(null)

    if (!board) return
    const boardId = board.id

    // Initialize tabId once on client
    if (typeof window !== 'undefined' && tabIdRef.current === null) {
        let existing = sessionStorage.getItem('tabId')
        if (!existing) {
            existing = uuidv4()
            sessionStorage.setItem('tabId', existing)
        }
        tabIdRef.current = existing
    }

    useEffect(() => {
        if (!tabIdRef.current) return
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
    }, [boardId])
}
