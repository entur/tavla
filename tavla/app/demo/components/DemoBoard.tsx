'use client'
import { Heading2, Heading3 } from '@entur/typography'
import { TileSelector } from 'app/(admin)/components/TileSelector'
import { formDataToTiles } from 'app/(admin)/components/TileSelector/utils'
import { useLocalStorage } from 'app/(admin)/hooks/useLocalStorage'
import { TileList } from 'app/(admin)/tavler/[id]/rediger/components/TileList'
import { DemoPreview } from 'app/demo/components/DemoPreview'
import { BoardDB } from 'src/types/db-types/boards'

const emptyDemoBoard = {
    id: 'demo',
    meta: { title: 'Demo' },
    tiles: [],
    isCombinedTiles: false,
}

function DemoBoard() {
    const [board, setBoard] = useLocalStorage<BoardDB>('board', emptyDemoBoard)

    function setTilesDemoBoard(tiles: BoardDB['tiles']) {
        setBoard({
            ...board,
            tiles,
        })
    }

    return (
        <>
            <div className="flex flex-col gap-4">
                <Heading3 as="h2" margin="top">
                    Hvilke stoppesteder vil du vise i tavlen?
                </Heading3>
                <TileSelector
                    action={async (data: FormData) => {
                        const tiles = formDataToTiles(data)
                        setBoard({
                            ...board,
                            tiles: [...board.tiles, ...tiles],
                        })
                    }}
                    trackingLocation="demo_page"
                />
                <TileList
                    board={board}
                    setTilesDemoBoard={setTilesDemoBoard}
                    bid="demo"
                />
            </div>
            <div className="flex flex-col gap-4">
                <Heading2>Forhåndsvisning</Heading2>
                <DemoPreview board={board} />
            </div>
        </>
    )
}

export { DemoBoard }
