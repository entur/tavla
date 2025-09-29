import { useEffect, useRef } from 'react'
import { TBoard } from 'types/settings'
import { getBackendUrl } from 'utils/index'
import { v4 as uuidv4 } from 'uuid'

export function useHeartbeat(board: TBoard) {
    const tabIdRef = useRef<string | null>(null)

    useEffect(() => {
        if (typeof window !== 'undefined' && tabIdRef.current === null) {
            let existing = sessionStorage.getItem('tabId')
            if (!existing) {
                existing = uuidv4()
                sessionStorage.setItem('tabId', existing as string)
            }
            tabIdRef.current = existing
        }
    }, [])

    const getBrowserInfo = () => {
        if (typeof window === 'undefined') return 'Unknown'
        const userAgent = window.navigator.userAgent
        if (userAgent.includes('Chrome')) return 'Chrome'
        if (userAgent.includes('Firefox')) return 'Firefox'
        if (userAgent.includes('Safari')) return 'Safari'
        if (userAgent.includes('Edge')) return 'Edge'
        return 'Other'
    }

    // Get screen dimensions
    const getScreenDimensions = () => {
        if (typeof window === 'undefined') return { width: 1920, height: 1080 }
        return {
            width: window.screen.width,
            height: window.screen.height,
        }
    }

    useEffect(() => {
        if (!board) return
        if (!tabIdRef.current) return

        if (typeof window !== 'undefined') {
            const pathname = window.location.pathname
            if (
                pathname.includes('/admin/') ||
                pathname.includes('/rediger') ||
                pathname.includes('/demo') ||
                pathname.includes('/auth') ||
                pathname.includes('/help') ||
                pathname.includes('/privacy')
            ) {
                return
            }
        }

        const backendUrl = getBackendUrl()
        const apiKey =
            process.env.NEXT_PUBLIC_BACKEND_API_KEY ||
            process.env.BACKEND_API_KEY

        if (!apiKey) {
            // Silently disable heartbeat
            return
        }

        const sendHeartbeat = async () => {
            try {
                const screen = getScreenDimensions()
                const browser = getBrowserInfo()

                const response = await fetch(`${backendUrl}/heartbeat`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${apiKey}`,
                    },
                    body: JSON.stringify({
                        bid: board.id,
                        tid: tabIdRef.current,
                        browser,
                        screen_width: screen.width,
                        screen_height: screen.height,
                    }),
                })

                if (!response.ok) {
                    throw new Error(`Heartbeat failed: ${response.status}`)
                }
            } catch (error) {
                throw new Error('Heartbeat failed', { cause: error })
            }
        }

        sendHeartbeat()

        const interval = setInterval(sendHeartbeat, 30_000)

        return () => clearInterval(interval)
    }, [board])
}
