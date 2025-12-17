'use client'
import { Heading2, Heading3 } from '@entur/typography'
import { TileSelector } from 'app/(admin)/components/TileSelector'
import { formDataToTile } from 'app/(admin)/components/TileSelector/utils'
import { useLocalStorage } from 'app/(admin)/hooks/useLocalStorage'
import { TileList } from 'app/(admin)/tavler/[id]/rediger/components/TileList'
import { Board } from 'Board/scenarios/Board'
import { Header } from 'components/Header'
import { InfoMessage } from 'components/InfoMessage'
import { usePostHog } from 'posthog-js/react'
import { BoardDB } from 'types/db-types/boards'

const emptyDemoBoard = {
    id: 'demo',
    meta: { title: 'Demo' },
    tiles: [],
}

function DemoBoard() {
    const [board, setBoard] = useLocalStorage<BoardDB>('board', emptyDemoBoard)

    const posthog = usePostHog()

    return (
        <>
            <div className="flex flex-col gap-4">
                <Heading3 as="h2" margin="top">
                    Hvilke stoppesteder vil du vise i tavlen?
                </Heading3>
                <TileSelector
                    action={async (data: FormData) => {
                        const tile = formDataToTile(data)
                        setBoard({ ...board, tiles: [...board.tiles, tile] })
                        posthog.capture('ADD_STOP_PLACE_DEMO_PAGE')
                    }}
                />
                <TileList board={board} setDemoBoard={setBoard} bid="demo" />
            </div>
            <div className="flex flex-col gap-4">
                <Heading2>Forhåndsvisning</Heading2>
                <div
                    className="previewContainer md:text-2xl"
                    data-theme={board?.theme ?? 'dark'}
                >
                    <Header
                        theme={board.theme}
                        hideClock={board.hideClock}
                        hideLogo={board.hideLogo}
                    />
                    <div className="h-96 md:h-[50rem]">
                        <Board board={board} />
                    </div>
                    <InfoMessage board={board} />
                </div>
            </div>
        </>
    )
}

export { DemoBoard }
