import { SearchableDropdown } from '@entur/dropdown'
import { usePointSearch } from 'app/(admin)/hooks/usePointSearch'

function Adress() {
    const { pointItems, selectedPoint, setSelectedPoint } = usePointSearch()
    return (
        <div>
            <SearchableDropdown
                label="Adresse"
                items={pointItems}
                selectedItem={selectedPoint}
                onChange={setSelectedPoint}
                debounceTimeout={1000}
                clearable
            />
        </div>
    )
}

export { Adress }
