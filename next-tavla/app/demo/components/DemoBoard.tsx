'use client'
import { Heading2 } from '@entur/typography'
import { TileSelector } from 'app/(admin)/components/TileSelector'
import { formDataToTile } from 'app/(admin)/components/TileSelector/utils'
import { Preview } from 'app/(admin)/edit/[id]/components/Preview'
import { TileCard } from 'app/(admin)/edit/[id]/components/TileCard'
import useLocalStorage from '../../(admin)/hooks/useLocalStorage'
import { TTile } from 'types/tile'
import { usePostHog } from 'posthog-js/react'

const emptyDemoBoard = {
    id: 'demo',
    meta: { title: 'Demo' },
    tiles: [],
}

function DemoBoard() {
    const [board, setBoard] = useLocalStorage('board', emptyDemoBoard)

    const posthog = usePostHog()

    return (
        <>
            <div className="flex flex-col gap-4">
                <Heading2>Hvilke stoppesteder vil du vise i tavlen?</Heading2>
                <TileSelector
                    action={async (data: FormData) => {
                        const tile = formDataToTile(data)
                        setBoard({ ...board, tiles: [...board.tiles, tile] })
                        posthog.capture('ADD_STOP_PLACE_DEMO_PAGE')
                    }}
                    col={false}
                />
                {board.tiles?.map((tile: TTile) => (
                    <TileCard
                        key={tile.uuid}
                        tile={tile}
                        bid={board.id ?? 'demo'}
                        demoBoard={board}
                        setDemoBoard={setBoard}
                    />
                ))}
            </div>
            <div className="flex flex-col gap-4">
                <Heading2>Forhåndsvisning</Heading2>
                <Preview board={board} />
            </div>
        </>
    )
}

export { DemoBoard }
