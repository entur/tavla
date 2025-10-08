import { useEffect, useRef } from 'react'
import { TBoard } from 'types/settings'
import { getBackendUrl } from 'utils/index'

declare global {
    interface Window {
        __tabId?: string
    }
}

function safeUuidV4(): string {
    try {
        if (typeof window !== 'undefined' && window.crypto) {
            if (typeof window.crypto.randomUUID === 'function') {
                return window.crypto.randomUUID()
            }

            if (typeof window.crypto.getRandomValues === 'function') {
                const bytes = new Uint8Array(16)
                window.crypto.getRandomValues(bytes)
                // Format bytes as UUIDv4
                if (
                    bytes &&
                    typeof bytes[6] !== 'undefined' &&
                    typeof bytes[8] !== 'undefined' &&
                    bytes.length >= 16
                ) {
                    bytes[6] = (bytes[6] & 0x0f) | 0x40
                    bytes[8] = (bytes[8] & 0x3f) | 0x80
                    const hex = Array.from(bytes, (b) =>
                        b.toString(16).padStart(2, '0'),
                    )
                    return (
                        hex.slice(0, 4).join('') +
                        '-' +
                        hex.slice(4, 6).join('') +
                        '-' +
                        hex.slice(6, 8).join('') +
                        '-' +
                        hex.slice(8, 10).join('') +
                        '-' +
                        hex.slice(10, 16).join('')
                    )
                }
            }
        }
    } catch {}

    //Fallback for old screens
    const hex = '0123456789abcdef'
    let uuid = ''
    for (let i = 0; i < 36; i++) {
        if (i === 8 || i === 13 || i === 18 || i === 23) uuid += '-'
        else if (i === 14) uuid += '4'
        else if (i === 19) uuid += hex[((Math.random() * 4) | 0) + 8]
        else uuid += hex[(Math.random() * 16) | 0]
    }
    return uuid
}

interface FetchOptions {
    method?: string
    headers?: Record<string, string>
    body?: string
}

type SafeResponse = { ok: boolean; status: number; text: string }

async function safeFetch(
    url: string,
    options: FetchOptions,
): Promise<SafeResponse> {
    if (typeof fetch !== 'undefined') {
        return fetch(url, options).then(async (r) => ({
            ok:
                typeof r.ok === 'boolean'
                    ? r.ok
                    : r.status >= 200 && r.status < 300,
            status: r.status,
            text: await r.text(),
        }))
    }

    return new Promise((resolve, reject) => {
        try {
            const xhr = new XMLHttpRequest()
            xhr.open(options.method || 'GET', url, true)

            const headers = options.headers || {}
            for (const k in headers) {
                if (Object.prototype.hasOwnProperty.call(headers, k)) {
                    xhr.setRequestHeader(k, headers[k]!)
                }
            }

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    resolve({
                        ok: xhr.status >= 200 && xhr.status < 300,
                        status: xhr.status,
                        text: xhr.responseText || '',
                    })
                }
            }
            xhr.onerror = () => reject(new Error('Network error'))
            xhr.send(options.body || null)
        } catch (e) {
            reject(e)
        }
    })
}

export function useHeartbeat(board: TBoard) {
    const tabIdRef = useRef<string | null>(null)

    useEffect(() => {
        if (typeof window === 'undefined') return

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
        if (!board) return

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
                    headers: { 'Content-Type': 'text/plain' },
                    body: JSON.stringify({
                        bid: board.id,
                        tid: tabIdRef.current,
                        browser: userAgent,
                        screen_width: screenInfo.width,
                        screen_height: screenInfo.height,
                    }),
                })
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
    }, [board])
}
