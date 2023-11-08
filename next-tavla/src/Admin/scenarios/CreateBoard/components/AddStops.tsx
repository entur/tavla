import { Button } from '@entur/button'
import { Heading3, Heading4, Paragraph } from '@entur/typography'
import { TBoard } from 'types/settings'
import { useCreateBoardDispatch } from '../utils/context'
import { AddTile } from 'Admin/scenarios/Edit/components/AddTile'
import { TCreatePage } from 'Admin/types/createBoard'
import { useToast } from '@entur/alert'
import { StopPlaceList } from './StopPlaceList'

export function AddStops({
    board,
    popPage,
    pushPage,
}: {
    board: TBoard
    popPage: () => void
    pushPage: (page: TCreatePage) => void
}) {
    const dispatch = useCreateBoardDispatch()
    const { addToast } = useToast()
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

    const nextStep = () => {
        if (!board?.tiles?.length) {
            return addToast({
                title: 'Ingen holdeplasser er lagt til',
                content: 'Vennligst legg til en holdeplass for å fortsette',
                variant: 'info',
            })
        }
        pushPage('organization')
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
                <PrimaryButton onClick={nextStep}>Neste</PrimaryButton>
            </div>
        </div>
    )
}
