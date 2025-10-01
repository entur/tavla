import { useEffect, useRef } from 'react'
import { TBoard } from 'types/settings'
import { getBackendUrl } from 'utils/index'

const safeUuidV4 = () => {
    try {
        if (window && window.crypto && window.crypto.randomUUID) {
            return window.crypto.randomUUID()
        }
    } catch {}

    // Generate a UUID-like string that backend can parse
    // Format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    const hex = '0123456789abcdef'
    let uuid = ''
    for (let i = 0; i < 36; i++) {
        if (i === 8 || i === 13 || i === 18 || i === 23) {
            uuid += '-'
        } else if (i === 14) {
            uuid += '4' // Version 4
        } else if (i === 19) {
            uuid += hex[((Math.random() * 4) | 0) + 8] // 8, 9, A, or B
        } else {
            uuid += hex[(Math.random() * 16) | 0]
        }
    }
    return uuid
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
                // Use old-school syntax for TV compatibility (no optional chaining or nullish coalescing)
                const screen = {
                    width:
                        (window && window.screen && window.screen.width) || 0,
                    height:
                        (window && window.screen && window.screen.height) || 0,
                }
                const userAgent =
                    (window &&
                        window.navigator &&
                        window.navigator.userAgent) ||
                    'Unknown'

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
