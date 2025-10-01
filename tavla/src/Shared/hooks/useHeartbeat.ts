import { useEffect, useRef } from 'react'
import { TBoard } from 'types/settings'
import { getBackendUrl } from 'utils/index'

declare global {
    interface Window {
        __tabId?: string
    }
}

// Try to use crypto.randomUUID, fallback to manual v4 UUID
function safeUuidV4(): string {
    try {
        if (
            typeof window !== 'undefined' &&
            window.crypto &&
            typeof window.crypto.randomUUID === 'function'
        ) {
            return window.crypto.randomUUID()
        }
    } catch {}

    const hex = '0123456789abcdef'
    let uuid = ''
    for (let i = 0; i < 36; i++) {
        if (i === 8 || i === 13 || i === 18 || i === 23) {
            uuid += '-'
        } else if (i === 14) {
            uuid += '4'
        } else if (i === 19) {
            uuid += hex[((Math.random() * 4) | 0) + 8] // 8, 9, A, or B
        } else {
            uuid += hex[(Math.random() * 16) | 0]
        }
    }
    return uuid
}

interface FetchOptions {
    method?: string
    headers?: Record<string, string>
    body?: string
}

function safeFetch(url: string, options: FetchOptions): Promise<Response> {
    if (typeof fetch !== 'undefined') {
        return fetch(url, options)
    }

    return new Promise((resolve, reject) => {
        try {
            const xhr = new XMLHttpRequest()
            xhr.open(options.method || 'GET', url, true)

            if (options.headers) {
                for (const key in options.headers) {
                    if (
                        Object.prototype.hasOwnProperty.call(
                            options.headers,
                            key,
                        )
                    ) {
                        const headerValue = options.headers[key]
                        if (typeof headerValue === 'string') {
                            xhr.setRequestHeader(key, headerValue)
                        }
                    }
                }
            }

            xhr.onload = function () {
                resolve(new Response(xhr.responseText, { status: xhr.status }))
            }

            xhr.onerror = () => reject(new Error('Network error'))
            xhr.send(options.body || null)
        } catch (err) {
            reject(err)
        }
    })
}

export function useHeartbeat(board: TBoard, apiKey: string) {
    const tabIdRef = useRef<string | null>(null)

    useEffect(() => {
        if (typeof window === 'undefined') {
            return
        }

        try {
            if (tabIdRef.current === null) {
                let existingId: string | null = null
                try {
                    existingId = sessionStorage.getItem('tabId')
                } catch {}

                if (!existingId) {
                    existingId = safeUuidV4()
                    try {
                        sessionStorage.setItem('tabId', existingId)
                    } catch {
                        window.__tabId = existingId
                    }
                }

                if (!existingId && window.__tabId) {
                    existingId = window.__tabId
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

        let interval: NodeJS.Timeout | undefined

        function sendHeartbeat() {
            if (!tabIdRef.current) {
                if (interval) clearInterval(interval)
                return
            }

            try {
                const screenInfo = {
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

                safeFetch(getBackendUrl() + '/heartbeat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + apiKey,
                    },
                    body: JSON.stringify({
                        bid: board.id,
                        tid: tabIdRef.current,
                        browser: userAgent,
                        screen_width: screenInfo.width,
                        screen_height: screenInfo.height,
                    }),
                }).catch(() => {})
            } catch {
                if (interval) clearInterval(interval)
            }
        }

        if (tabIdRef.current) {
            sendHeartbeat()
            interval = setInterval(sendHeartbeat, 30000)
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [board, apiKey])
}
