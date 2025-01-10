import { TBoard } from 'types/settings'
import { TTile } from 'types/tile'
import { StopPlaceTile } from '../StopPlaceTile'
import { QuayTile } from '../QuayTile'
import { Tile } from 'components/Tile'
import { defaultFontSize, getFontScale } from 'Board/scenarios/Board/utils'
import { CSSProperties } from 'react'

function BoardTile({ tileSpec }: { tileSpec: TTile }) {
    switch (tileSpec.type) {
        case 'stop_place':
            return <StopPlaceTile {...tileSpec} />
        case 'quay':
            return <QuayTile {...tileSpec} />
    }
}

function Board({ board, style }: { board: TBoard; style?: CSSProperties }) {
    if (!board.tiles || !board.tiles.length)
        return (
            <Tile className="flex items-center justify-center">
                <p>Du har ikke lagt til noen stoppesteder ennå.</p>
            </Tile>
        )

    return (
        <div
            className={`max-sm:overflow-scroll grid grid-cols-auto-fit-minmax gap-2.5 h-full overflow-hidden supports-[not(display:grid)]:flex supports-[not(display:grid)]:*:m-2.5 ${getFontScale(
                board.meta?.fontSize || defaultFontSize(board),
            )} `}
            style={{
                ...style,
            }}
        >
            {board.tiles.map((tile, index) => {
                return <BoardTile key={index} tileSpec={tile} />
            })}
        </div>
    )
}

export { Board }
