'use client'

import { LOCAL_STORAGE_BOARD_ID } from 'app/_hooks/useSaveBoardInLocalStorage'
import React, { useEffect, useRef } from 'react'
import type { BoardDB } from 'src/types/db-types/boards'
import { getBoardLinkClient } from 'src/utils/boardLink'

const TAVLA_VISNING_ORIGINS = {
    production: 'https://vis-tavla.entur.no',
    development: 'https://vis-tavla.dev.entur.no',
    local: 'http://localhost:5173',
} as const

function isValidTavlaVisningOrigin(origin: string): boolean {
    return (
        origin === TAVLA_VISNING_ORIGINS.production ||
        origin === TAVLA_VISNING_ORIGINS.development ||
        origin === TAVLA_VISNING_ORIGINS.local
    )
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

/**
 * Live preview for an existing board. The iframe is loaded in tavla-visning's
 * demo mode (the `demo` board id) so it performs the DEMO_BOARD handshake and
 * renders whatever board object we post — letting unsaved, in-memory edits show
 * instantly. Loading the real board URL instead would make visning render the
 * saved Firestore state and ignore our postMessage updates.
 */
function BoardPreview({ board }: { board: BoardDB }) {
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

    useEffect(function setInitialIframeSrc() {
        setIframeSrc(getBoardLinkClient(LOCAL_STORAGE_BOARD_ID))
    }, [])

    useEffect(function resetIframeLoadedFlagOnSrcChange() {
        iframeOriginRef.current = null
    }, [])

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
            className={`previewContainer md:text-2xl ${board?.theme === 'dark' ? 'bg-black' : 'bg-primary'}`}
            data-theme={board?.theme ?? 'dark'}
        >
            <section
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
            </section>
        </div>
    )
}

export { BoardPreview }
