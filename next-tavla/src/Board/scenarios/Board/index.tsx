import { TBoard } from 'types/settings'
import { TTile } from 'types/tile'
import { StopPlaceTile } from '../StopPlaceTile'
import { QuayTile } from '../QuayTile'
import classes from './styles.module.css'
import { Tile } from 'components/Tile'
import { getFontScale } from 'Board/scenarios/Board/utils'

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
            <Tile className={classes.emptyTile}>
                <p>Du har ikke lagt til noen holdeplasser enda.</p>
            </Tile>
        )

    return (
        <div
            className={classes.board}
            style={{
                fontSize: 100 * getFontScale(board.meta?.fontSize) + '%',
            }}
        >
            {board.tiles.map((tile, index) => {
                return <BoardTile key={index} tileSpec={tile} />
            })}
        </div>
    )
}

export { Board }
