'use client'

import React, { useEffect, useRef } from 'react'
import { BoardDB } from 'types/db-types/boards'

function getTavlaVisningOrigin(hostname: string): string {
    return hostname.includes('localhost')
        ? 'http://localhost:5173'
        : hostname.includes('dev.entur.no')
          ? 'https://vis-tavla.dev.entur.no'
          : 'https://vis-tavla.entur.no'
}

function getCurrentOrigin(): string {
    const hostname =
        typeof window !== 'undefined' ? window.location.hostname : ''
    return getTavlaVisningOrigin(hostname)
}

function sendDemoBoardMessage(
    iframe: HTMLIFrameElement | null,
    board: BoardDB,
    targetOrigin: string,
): void {
    iframe?.contentWindow?.postMessage(
        {
            type: 'DEMO_BOARD',
            board: board,
        },
        targetOrigin,
    )
}

function DemoPreview({ board }: { board: BoardDB }) {
    const iframeRef = useRef<HTMLIFrameElement>(null)
    const [iframeSrc, setIframeSrc] = React.useState<string>('')
    const isIframeLoadedRef = useRef(false)

    useEffect(() => {
        setIframeSrc(`${getCurrentOrigin()}/demo`)
    }, [])

    // Setup message listeners and iframe load handler
    useEffect(() => {
        if (!iframeRef.current) return

        const handleMessage = (event: MessageEvent) => {
            const isValidOrigin =
                event.origin === 'https://vis-tavla.entur.no' ||
                event.origin === 'https://vis-tavla.dev.entur.no' ||
                event.origin.includes('localhost')

            if (isValidOrigin && event.data?.type === 'READY_FOR_DEMO_BOARD') {
                isIframeLoadedRef.current = true
                sendDemoBoardMessage(iframeRef.current, board, event.origin)
            }
        }

        window.addEventListener('message', handleMessage)

        const iframe = iframeRef.current
        const handleLoad = () => {
            isIframeLoadedRef.current = true
            setTimeout(() => {
                sendDemoBoardMessage(iframe, board, getCurrentOrigin())
            }, 100)
        }

        iframe?.addEventListener('load', handleLoad)

        return () => {
            window.removeEventListener('message', handleMessage)
            iframe?.removeEventListener('load', handleLoad)
        }
    }, [board])

    // Send board updates when board/folder changes
    useEffect(() => {
        if (!isIframeLoadedRef.current || !iframeRef.current) return

        sendDemoBoardMessage(iframeRef.current, board, getCurrentOrigin())
    }, [board])

    return (
        <div
            className="previewContainer md:text-2xl"
            data-theme={board?.theme ?? 'dark'}
        >
            <div className="h-96 md:h-[50rem]">
                {iframeSrc && (
                    <iframe
                        ref={iframeRef}
                        src={iframeSrc}
                        className="h-96 w-full border-0 md:h-[50rem]"
                        title="Demo Board Preview"
                    />
                )}
            </div>
        </div>
    )
}

export { DemoPreview }
