import { Paragraph } from '@entur/typography'
import { TBoard } from 'types/settings'
import { StopPlaceChip } from './StopPlaceChip'

function StopPlaceList({ board }: { board: TBoard }) {
    if (board.tiles.length === 0) {
        return (
            <Paragraph>
                Du har ikke lagt til noen stoppesteder i tavla enda.
            </Paragraph>
        )
    }

    return (
        <div className="flexRow g-2">
            {board.tiles.map((tile) => (
                <StopPlaceChip tile={tile} key={tile.uuid} />
            ))}
        </div>
    )
}

export { StopPlaceList }
