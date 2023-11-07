import { Button } from '@entur/button'
import { Heading3, Paragraph } from '@entur/typography'
import { StopPlaceChip } from './StopPlaceChip'
import { TBoard } from 'types/settings'
import { useCreateBoardDispatch } from '../utils/context'
import { AddTile } from 'Admin/scenarios/Edit/components/AddTile'
import { CreateBoardButton } from './CreateBoardButton'

export function AddStops({
    board,
    popPage,
}: {
    board: TBoard
    popPage: () => void
}) {
    const dispatch = useCreateBoardDispatch()

    const addTile = (
        name: string,
        placeId: string,
        type: 'quay' | 'stop_place',
    ) => {
        dispatch({
            type: 'addTile',
            tile: {
                type,
                placeId,
                name,
            },
        })
    }

    return (
        <div>
            <Heading3>Legg til holdeplasser i Tavla </Heading3>
            <Paragraph>
                Søk etter stoppesteder og bestem om tavla skal vise alle
                retninger, eller flere enkelte retninger.
            </Paragraph>

            <AddTile addTile={addTile} />
            <div className="flexRow g-2 pt-2 pb-2">
                {board.tiles.map((tile) => (
                    <StopPlaceChip tile={tile} key={tile.uuid} />
                ))}
            </div>
            <div className="flexRow justifyBetween">
                <Button variant="secondary" onClick={popPage}>
                    Tilbake
                </Button>
                <CreateBoardButton board={board} />
            </div>
        </div>
    )
}
