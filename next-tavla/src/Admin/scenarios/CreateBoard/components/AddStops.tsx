import { Button, PrimaryButton } from '@entur/button'
import { Dropdown, MultiSelect, SearchableDropdown } from '@entur/dropdown'
import { SearchIcon } from '@entur/icons'
import { Heading3, Paragraph } from '@entur/typography'
import { useCountiesSearch } from 'Admin/scenarios/Edit/hooks/useCountiesSearch'
import { useStopPlaceSearch } from 'Admin/scenarios/Edit/hooks/useStopPlaceSearch'
import { createBoardRequest } from '../utils/create'
import { useRouter } from 'next/router'
import { StopPlaceChip } from './StopPlaceChip'
import { useToast } from '@entur/alert'
import { TBoard } from 'types/settings'
import { useCreateBoardDispatch } from '../utils/context'
import { useQuaySearch } from 'Admin/scenarios/Edit/hooks/useQuaySearch'

export function AddStops({
    board,
    popPage,
}: {
    board: TBoard
    popPage: () => void
}) {
    const router = useRouter()
    const { addToast } = useToast()
    const { counties, selectedCounties, setSelectedCounties } =
        useCountiesSearch()

    const { stopPlaceItems, selectedStopPlace, setSelectedStopPlace } =
        useStopPlaceSearch(selectedCounties.map((county) => county.value))

    const { quays, selectedQuay, setSelectedQuay } = useQuaySearch(
        selectedStopPlace?.value ?? '',
    )
    const dispatch = useCreateBoardDispatch()

    const handleAddTiles = () => {
        if (!selectedStopPlace?.value) {
            return addToast({
                title: 'Ingen holdeplass er valgt',
                content: 'Vennligst velg en holdeplass å legge til',
                variant: 'info',
            })
        }
        if (selectedQuay && selectedQuay.value !== 'all') {
            dispatch({
                type: 'addTile',
                tile: {
                    type: 'quay',
                    placeId: selectedQuay.value,
                    name:
                        selectedStopPlace.label.split(',')[0] +
                            ' ' +
                            selectedQuay.label ?? 'Ikke navngitt',
                },
            })
        } else {
            dispatch({
                type: 'addTile',
                tile: {
                    type: 'stop_place',
                    placeId: selectedStopPlace.value,
                    name:
                        selectedStopPlace.label.split(',')[0] ??
                        'Ikke navngitt',
                },
            })
        }
        setSelectedStopPlace(null)
        setSelectedQuay(null)
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

            <div className="flexRow g-2 pt-2 pb-2">
                <MultiSelect
                    label="Velg fylker"
                    items={counties}
                    selectedItems={selectedCounties}
                    onChange={setSelectedCounties}
                    prepend={<SearchIcon />}
                    maxChips={1}
                    hideSelectAll
                />
                <SearchableDropdown
                    items={stopPlaceItems}
                    label="Søk etter holdeplass..."
                    clearable
                    prepend={<SearchIcon />}
                    selectedItem={selectedStopPlace}
                    onChange={setSelectedStopPlace}
                />
                <Dropdown
                    items={quays}
                    label="Velg plattform/retning"
                    clearable
                    selectedItem={selectedQuay}
                    onChange={setSelectedQuay}
                />
                <Button variant="primary" onClick={handleAddTiles}>
                    Legg til
                </Button>
            </div>
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
