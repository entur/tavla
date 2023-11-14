import { Button } from '@entur/button'
import { Heading3, Heading4, Paragraph } from '@entur/typography'
import { TBoard, TOrganizationID } from 'types/settings'
import { useCreateBoardDispatch } from '../utils/context'
import { AddTile } from 'Admin/scenarios/Edit/components/AddTile'
import { StopPlaceList } from './StopPlaceList'
import { CreateBoardButton } from './CreateBoardButton'

export function AddStops({
    board,
    popPage,
    oid,
}: {
    board: TBoard
    popPage: () => void
    oid?: TOrganizationID
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
            <Heading3>Legg til stoppesteder i Tavla </Heading3>
            <Paragraph>
                Søk etter stoppesteder og bestem om tavla skal vise alle
                retninger, eller flere enkelte retninger.
            </Paragraph>

            <AddTile addTile={addTile} flexDirection="flexColumn" />
            <Heading4>Stoppesteder lagt til i Tavla</Heading4>
            <StopPlaceList board={board} />
            <div className="flexRow justifyBetween">
                <Button className="w-30" variant="secondary" onClick={popPage}>
                    Tilbake
                </Button>
                <CreateBoardButton board={board} oid={oid} />
            </div>
        </div>
    )
}
