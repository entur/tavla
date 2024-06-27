'use client'
import { Heading1, Heading2, Paragraph } from '@entur/typography'
import { TileSelector } from 'app/(admin)/components/TileSelector'
import { formDataToTile } from 'app/(admin)/components/TileSelector/utils'
import { Preview } from 'app/(admin)/edit/[id]/components/Preview'
import { TileCard } from 'app/(admin)/edit/[id]/components/TileCard'
import { useEffect, useState } from 'react'
import { TBoard } from 'types/settings'

function Demo() {
    const emptyDemoBoard = {
        id: 'demo',
        meta: { title: 'Demo' },
        tiles: [],
    }

    const [board, setBoard] = useState<TBoard>(() => {
        const localStorageBoard = localStorage.getItem('board')
        return localStorageBoard
            ? JSON.parse(localStorageBoard)
            : emptyDemoBoard
    })

    useEffect(() => {
        localStorage.setItem('board', JSON.stringify(board))
    }, [board])

    return (
        <main className="container mx-auto pt-8 pb-20">
            <Heading1>Test ut å lage din egen tavle</Heading1>
            <Paragraph>
                Her kan du prøve å opprette din egen tavle for å se hvordan det
                kan se ut hos deg.
            </Paragraph>
            <div className="flex flex-col gap-4">
                <Heading2>Stoppesteder i tavlen</Heading2>
                <TileSelector
                    action={async (data: FormData) => {
                        const tile = formDataToTile(data)
                        setBoard({ ...board, tiles: [...board.tiles, tile] })
                    }}
                    col={false}
                ></TileSelector>
                {board.tiles?.map((tile) => (
                    <TileCard
                        key={tile.uuid}
                        tile={tile}
                        bid={board.id ?? 'demo'}
                        demoBoard={board}
                        setDemoBoard={setBoard}
                    ></TileCard>
                ))}
            </div>
            <div className="flex flex-col gap-4 mt-10">
                <Heading2>Forhåndsvisning</Heading2>
                <Preview board={board} />
            </div>
        </main>
    )
}

export default Demo
