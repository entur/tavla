'use client'

import { isValidTavlaVisningOrigin } from 'app/demo/constants'
import React, { useEffect, useRef } from 'react'
import { BoardDB } from 'src/types/db-types/boards'
import { getBoardLinkClient } from 'src/utils/boardLink'

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
    const boardRef = useRef<BoardDB>(board)
    const iframeOriginRef = useRef<string | null>(null)

    useEffect(
        function syncBoardRef() {
            boardRef.current = board
        },
        [board],
    )

    useEffect(
        function setInitialIframeSrc() {
            setIframeSrc(getBoardLinkClient(board.id))
        },
        [board.id],
    )

    useEffect(
        function resetIframeLoadedFlagOnSrcChange() {
            iframeOriginRef.current = null
        },
        [iframeSrc],
    )

    useEffect(function setupMessageListenerForHandshake() {
        const handleMessage = (event: MessageEvent) => {
            const isCorrectIframe =
                iframeRef.current?.contentWindow &&
                event.source === iframeRef.current.contentWindow

            if (
                !isCorrectIframe ||
                !isValidTavlaVisningOrigin(event.origin) ||
                event.data?.type !== 'READY_FOR_DEMO_BOARD'
            ) {
                return
            }

            iframeOriginRef.current = event.origin
            sendDemoBoardMessage(
                iframeRef.current,
                boardRef.current,
                event.origin,
            )
        }

        window.addEventListener('message', handleMessage)

        return () => {
            window.removeEventListener('message', handleMessage)
            iframeOriginRef.current = null
        }
    }, [])

    useEffect(
        function sendBoardUpdatesToIframe() {
            if (!iframeOriginRef.current || !iframeRef.current) {
                return
            }
            sendDemoBoardMessage(
                iframeRef.current,
                board,
                iframeOriginRef.current,
            )
        },
        [board],
    )

    return (
        <div
            className="previewContainer md:text-2xl"
            data-theme={board?.theme ?? 'dark'}
        >
            <div
                className="h-96 md:h-[50rem]"
                aria-label="Forhåndsvisning av tavle"
            >
                {iframeSrc && (
                    <iframe
                        ref={iframeRef}
                        src={iframeSrc}
                        className="h-96 w-full border-0 md:h-[50rem]"
                        title="Forhåndsvisning av tavle"
                        sandbox="allow-scripts allow-same-origin"
                        referrerPolicy="no-referrer"
                        tabIndex={-1}
                    />
                )}
            </div>
        </div>
    )
}

export { DemoPreview }
