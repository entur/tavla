import { TBoard } from 'types/settings'
import { TTile } from 'types/tile'
import { StopPlaceTile } from '../StopPlaceTile'
import { QuayTile } from '../QuayTile'
import { Tile } from 'components/Tile'
import { defaultFontSize, getFontScale } from 'Board/scenarios/Board/utils'
import { CombinedTile } from '../CombinedTile'

function BoardTile({ tileSpec }: { tileSpec: TTile }) {
    switch (tileSpec.type) {
        case 'stop_place':
            return <StopPlaceTile {...tileSpec} />
        case 'quay':
            return <QuayTile {...tileSpec} />
    }
}

function Board({ board }: { board: TBoard }) {
    if (!board.tiles || !board.tiles.length)
        return (
            <Tile className="flex items-center justify-center">
                <p>Du har ikke lagt til noen stoppesteder ennå.</p>
            </Tile>
        )

    const combinedTiles = getCombinedTiles(board)
    const separateTiles = getSeparateTiles(board)

    return (
        <div
            className={`grid h-full grid-cols-auto-fit-minmax gap-2.5 overflow-hidden supports-[not(display:grid)]:flex supports-[not(display:grid)]:*:m-2.5 max-sm:overflow-y-scroll ${getFontScale(
                board.meta?.fontSize || defaultFontSize(board),
            )} `}
        >
            {separateTiles.map((tile, index) => {
                return <BoardTile key={index} tileSpec={tile} />
            })}
            {combinedTiles.map((combinedTile, index) => {
                return <CombinedTile key={index} combinedTile={combinedTile} />
            })}
        </div>
    )
}

export { Board }

function getCombinedTiles(board: TBoard) {
    const combinedTileIds =
        board.combinedTiles?.map((combineTile) => combineTile.ids) ?? []

    const combinedTiles =
        combinedTileIds?.map((tileIds) =>
            board.tiles.filter((tile) => tileIds.includes(tile.uuid)),
        ) || []

    return combinedTiles
}

function getSeparateTiles(board: TBoard) {
    const combinedTileIds =
        board.combinedTiles?.map((combineTile) => combineTile.ids) ?? []

    const separateTiles = board.tiles.filter(
        (tile) => !combinedTileIds?.flat().includes(tile.uuid),
    )

    return separateTiles
}
