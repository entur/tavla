import { useToast } from '@entur/alert'
import { SearchableDropdown } from '@entur/dropdown'
import { ValidationInfoIcon } from '@entur/icons'
import { Heading3 } from '@entur/typography'
import { Tooltip } from 'app/(admin)/components/Tooltip'
import { saveLocation } from 'app/(admin)/edit/[id]/components/MetaSettings/actions'
import { usePointSearch } from 'app/(admin)/hooks/usePointSearch'
import { SubmitButton } from 'components/Form/SubmitButton'
import { TLocation } from 'types/meta'
import { TBoardID } from 'types/settings'

function Address({ bid, location }: { bid: TBoardID; location?: TLocation }) {
    const { pointItems, selectedPoint, setSelectedPoint } =
        usePointSearch(location)
    const { addToast } = useToast()
    return (
        <form
            action={() => {
                saveLocation(bid, selectedPoint?.value)
                addToast('Adresse oppdatert!')
            }}
            className="box flex flex-col justify-between"
        >
            <div>
                <div className="flex flex-row items-center gap-2 mb-2">
                    <Heading3 margin="none">Lokasjon</Heading3>
                    <Tooltip
                        content="Under innstillingene til hvert stoppested kan du velge om gåavstanden fra tavlen sin lokasjon skal vises"
                        placement="top"
                    >
                        <ValidationInfoIcon />
                    </Tooltip>
                </div>
                <SearchableDropdown
                    label="Hvor befinner tavlen seg?"
                    items={pointItems}
                    selectedItem={selectedPoint}
                    onChange={setSelectedPoint}
                    debounceTimeout={1000}
                    clearable
                />
                <div className="flex flex-row w-full mt-8 justify-end">
                    <SubmitButton variant="secondary">
                        Lagre lokasjon
                    </SubmitButton>
                </div>
            </div>
        </form>
    )
}

export { Address }
