import { Button } from '@entur/button'
import { SearchableDropdown } from '@entur/dropdown'
import { saveLocation } from 'app/(admin)/edit/[id]/components/MetaSettings/actions'
import { usePointSearch } from 'app/(admin)/hooks/usePointSearch'
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
            <Button variant="secondary" type="submit" className="mt-2">
                Lagre adresse
            </Button>
        </form>
    )
}

export { Adress }
