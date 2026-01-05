'use client'

import {
    getTavlaVisningOrigin,
    isValidTavlaVisningOrigin,
} from 'app/demo/constants'
import React, { useEffect, useRef } from 'react'
import { BoardDB } from 'types/db-types/boards'

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
            board,
        },
        targetOrigin,
    )
}

function DemoPreview({ board }: { board: BoardDB }) {
    const iframeRef = useRef<HTMLIFrameElement>(null)
    const [iframeSrc, setIframeSrc] = React.useState<string>('')
    const isIframeLoadedRef = useRef(false)
    const boardRef = useRef<BoardDB>(board)

    useEffect(
        function syncBoardRef() {
            boardRef.current = board
        },
        [board],
    )

    useEffect(function setInitialIframeSrc() {
        setIframeSrc(`${getCurrentOrigin()}/demo`)
    }, [])

    useEffect(
        function resetIframeLoadedFlagOnSrcChange() {
            isIframeLoadedRef.current = false
        },
        [iframeSrc],
    )

    useEffect(function setupMessageListenerForHandshake() {
        const handleMessage = (event: MessageEvent) => {
            if (
                !isValidTavlaVisningOrigin(event.origin) ||
                event.data?.type !== 'READY_FOR_DEMO_BOARD'
            ) {
                return
            }

            isIframeLoadedRef.current = true
            sendDemoBoardMessage(
                iframeRef.current,
                boardRef.current,
                event.origin,
            )
        }

        window.addEventListener('message', handleMessage)

        return () => {
            window.removeEventListener('message', handleMessage)
        }
    }, [])

    useEffect(
        function sendBoardUpdatesToIframe() {
            if (!isIframeLoadedRef.current || !iframeRef.current) return
            sendDemoBoardMessage(iframeRef.current, board, getCurrentOrigin())
        },
        [board],
    )

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
