import { SearchableDropdown } from '@entur/dropdown'
import { saveLocation } from 'app/(admin)/edit/[id]/components/MetaSettings/actions'
import { usePointSearch } from 'app/(admin)/hooks/usePointSearch'
import { SubmitButton } from 'components/Form/SubmitButton'
import { TLocation } from 'types/meta'
import { TBoardID } from 'types/settings'

function Adress({ bid, location }: { bid: TBoardID; location?: TLocation }) {
    const { pointItems, selectedPoint, setSelectedPoint } =
        usePointSearch(location)

    return (
        <form
            action={() => {
                saveLocation(bid, selectedPoint?.value)
            }}
        >
            <SearchableDropdown
                label="Adresse"
                items={pointItems}
                selectedItem={selectedPoint}
                onChange={setSelectedPoint}
                debounceTimeout={1000}
                clearable
            />
            <div className="flexRow w-100 mt-4 mr-2 justifyEnd">
                <SubmitButton variant="secondary" className="mt-2">
                    Lagre adresse
                </SubmitButton>
            </div>
        </form>
    )
}

export { Adress }
