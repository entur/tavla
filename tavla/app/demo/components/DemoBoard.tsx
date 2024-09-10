'use client'
import { Heading2, Heading3 } from '@entur/typography'
import { TileSelector } from 'app/(admin)/components/TileSelector'
import { formDataToTile } from 'app/(admin)/components/TileSelector/utils'
import { Preview } from 'app/(admin)/edit/[id]/components/Preview'
import { usePostHog } from 'posthog-js/react'
import { TileList } from 'app/(admin)/edit/[id]/components/TileList'
import { useLocalStorage } from 'app/(admin)/hooks/useLocalStorage'
import { TBoard } from 'types/settings'

const emptyDemoBoard = {
    id: 'demo',
    meta: { title: 'Demo' },
    tiles: [],
}

function DemoBoard() {
    const [board, setBoard] = useLocalStorage<TBoard>('board', emptyDemoBoard)

    const posthog = usePostHog()

    return (
        <>
            <div className="flex flex-col gap-4">
                <Heading3 as="h2" margin="none">
                    Hvilke stoppesteder vil du vise i tavlen?
                </Heading3>
                <TileSelector
                    action={async (data: FormData) => {
                        const tile = formDataToTile(data)
                        setBoard({ ...board, tiles: [...board.tiles, tile] })
                        posthog.capture('ADD_STOP_PLACE_DEMO_PAGE')
                    }}
                    col={false}
                />
                <TileList board={board} setDemoBoard={setBoard} bid="demo" />
            </div>
            <div className="flex flex-col gap-4">
                <Heading2>Forhåndsvisning</Heading2>
                <div className="text-2xl">
                    <Preview board={board} />
                </div>
            </div>
        </>
    )
}

export { DemoBoard }
