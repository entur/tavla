import { TBoard } from 'types/settings'
import { TTile } from 'types/tile'
import { StopPlaceTile } from '../StopPlaceTile'
import { QuayTile } from '../QuayTile'
import classes from './styles.module.css'
import { Tile } from 'components/Tile'
import { defaultFontSize, getFontScale } from 'Board/scenarios/Board/utils'
import { boardStyles, previewStyles } from 'types/board'

function BoardTile({
    tileSpec,
    preview,
}: {
    tileSpec: TTile
    preview?: boolean
}) {
    switch (tileSpec.type) {
        case 'stop_place':
            return <StopPlaceTile {...tileSpec} preview={preview} />
        case 'quay':
            return <QuayTile {...tileSpec} preview={preview} />
    }
}

function Board({ board, preview }: { board: TBoard; preview?: boolean }) {
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
                gridTemplateColumns: `repeat(auto-fit, minmax(${
                    preview ? previewStyles.grid : boardStyles.grid
                }vmin, 1fr))`,
                fontSize:
                    100 *
                        getFontScale(
                            board.meta?.fontSize || defaultFontSize(board),
                        ) +
                    '%',
            }}
        >
            {board.tiles.map((tile, index) => {
                return (
                    <BoardTile key={index} tileSpec={tile} preview={preview} />
                )
            })}
        </div>
    )
}

export { Board }
