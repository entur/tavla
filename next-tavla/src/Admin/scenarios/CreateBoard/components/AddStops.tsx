import { Button, PrimaryButton } from '@entur/button'
import { Heading3, Paragraph } from '@entur/typography'
import { createBoardRequest } from '../utils/create'
import { useRouter } from 'next/router'
import { StopPlaceChip } from './StopPlaceChip'
import { useToast } from '@entur/alert'
import { TBoard } from 'types/settings'
import { useCreateBoardDispatch } from '../utils/context'
import { AddTile } from 'Admin/scenarios/Edit/components/AddTile'

export function AddStops({
    board,
    popPage,
}: {
    board: TBoard
    popPage: () => void
}) {
    const router = useRouter()
    const { addToast } = useToast()

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

    const handleCreateBoard = async () => {
        if (!board?.tiles?.length) {
            return addToast({
                title: 'Ingen holdeplasser er lagt til',
                content: 'Vennligst legg til holdeplasser',
                variant: 'info',
            })
        }
        try {
            const response = await createBoardRequest(
                board?.tiles ?? [],
                board?.meta?.title ?? '',
            )
            router.push(`/edit/${response.bid}`)
            router.reload()
        } catch (error) {
            addToast({
                title: 'Noe gikk galt',
                content: 'Vennligst prøv igjen',
                variant: 'info',
            })
        }
    }

    return (
        <div>
            <Heading3>Legg til holdeplasser i Tavla </Heading3>
            <Paragraph>
                Søk etter stoppesteder og bestem om tavla skal vise alle
                retninger, eller flere enkelte retninger.
            </Paragraph>

            <AddTile addTile={addTile} flexDirection="flexColumn" />
            <div className="flexRow g-2 pt-2 pb-2">
                {board.tiles.map((tile) => (
                    <StopPlaceChip tile={tile} key={tile.uuid} />
                ))}
            </div>
            <div className="flexRow justifyBetween">
                <Button variant="secondary" onClick={popPage}>
                    Tilbake
                </Button>
                <PrimaryButton onClick={handleCreateBoard}>
                    Opprett tavle
                </PrimaryButton>
            </div>
        </div>
    )
}
