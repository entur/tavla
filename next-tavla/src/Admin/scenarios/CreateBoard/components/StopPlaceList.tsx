import { Paragraph } from '@entur/typography'
import { TBoard } from 'types/settings'
import { StopPlaceChip } from './StopPlaceChip'

function StopPlaceList({ board }: { board: TBoard }) {
    if (board.tiles.length === 0) {
        return (
            <div className="flexColumn">
                <Paragraph>
                    Du har ikke lagt til noen stoppesteder i tavla enda.
                </Paragraph>
            </div>
        )
    }

    return (
        <div className="flexColumn g-2 pt-2 pb-2">
            <div className="flexRow g-2">
                {board.tiles.map((tile) => (
                    <StopPlaceChip tile={tile} key={tile.uuid} />
                ))}
            </div>
        </div>
    )
}

export { StopPlaceList }
