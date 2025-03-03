import { TBoard } from 'types/settings'
import { Tile } from 'components/Tile'
import { TTile } from 'types/tile'
import { defaultFontSize, getFontScale } from '../Board/utils'
import { SingleStopPlaceTile } from './SingleStopPlace'
import { SingleQuayTile } from './SingleQuay'

function SingleTile({ tile }: { tile: TTile }) {
    switch (tile.type) {
        case 'stop_place':
            return <SingleStopPlaceTile tile={tile} />
        case 'quay':
            return <SingleQuayTile tile={tile} />
    }
}

function SingleDepartureView({ board }: { board: TBoard }) {
    const tile = board.tiles[0]

    if (!board.tiles || !board.tiles.length || !tile)
        return (
            <Tile className="flex items-center justify-center">
                <p>Du har ikke lagt til noen stoppesteder ennå.</p>
            </Tile>
        )
    return (
        <div
            className={`max-sm:overflow-y-scroll h-full ${getFontScale(
                board.meta?.fontSize || defaultFontSize(board),
            )} `}
        >
            <SingleTile tile={tile} />
        </div>
    )
}

export { SingleDepartureView }
