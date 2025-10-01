import { useEffect, useRef } from 'react'
import { TBoard } from 'types/settings'
import { getBackendUrl } from 'utils/index'

const safeUuidV4 = () => {
    try {
        if (window?.crypto?.randomUUID) {
            return window.crypto.randomUUID()
        }
    } catch {}

    return `tab-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

export function useHeartbeat(board: TBoard, apiKey: string) {
    const tabIdRef = useRef<string | null>(null)

    useEffect(() => {
        if (typeof window === 'undefined') {
            return
        }

        try {
            if (tabIdRef.current === null) {
                let existingId = null
                try {
                    existingId = sessionStorage.getItem('tabId')
                } catch {}

                if (!existingId) {
                    existingId = safeUuidV4()
                    try {
                        sessionStorage.setItem('tabId', existingId)
                    } catch {}
                }
                tabIdRef.current = existingId
            }
        } catch {}
    }, [])

    useEffect(() => {
        if (!apiKey || !board) {
            return
        }

        if (typeof window !== 'undefined') {
            const pathname = window.location.pathname
            if (
                pathname.includes('/admin/') ||
                pathname.includes('/rediger') ||
                pathname.includes('/demo')
            ) {
                return
            }
        }

        let interval: NodeJS.Timeout | undefined = undefined

        const sendHeartbeat = () => {
            if (!tabIdRef.current) {
                if (interval) clearInterval(interval)
                return
            }

            try {
                const screen = {
                    width: window?.screen?.width ?? 0,
                    height: window?.screen?.height ?? 0,
                }
                const userAgent = window?.navigator?.userAgent ?? 'Unknown'

                fetch(`${getBackendUrl()}/heartbeat`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${apiKey}`,
                    },
                    body: JSON.stringify({
                        bid: board.id,
                        tid: tabIdRef.current,
                        browser: userAgent,
                        screen_width: screen.width,
                        screen_height: screen.height,
                    }),
                }).catch(() => {})
            } catch {
                if (interval) clearInterval(interval)
            }
        }

        if (tabIdRef.current) {
            sendHeartbeat()
            interval = setInterval(sendHeartbeat, 30_000)
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [board, apiKey])
}
