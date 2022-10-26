import React, { useCallback } from 'react'
import { Coordinates } from '@entur/sdk'
import { Dropdown } from '@entur/dropdown'
import { getTranslation, isNotNullOrUndefined } from '../../../../utils'
import {
    BikePanelSearchStationFragment,
    useBikePanelSearchQuery,
} from '../../../../../graphql-generated/mobility-v2'
import './BikePanelSearch.scss'

const MAX_SEARCH_RANGE = 100_000

interface Item {
    value: string
    label: string
}

function mapFeaturesToItems(
    features: BikePanelSearchStationFragment[],
): Item[] {
    return features.map(({ id, name }) => ({
        value: id,
        label: getTranslation(name) || '',
    }))
}

interface BikePanelSearchProps {
    onSelected: (stationId: string) => void
    position: Coordinates
}

const BikePanelSearch: React.FC<BikePanelSearchProps> = ({
    onSelected,
    position,
}) => {
    const { data } = useBikePanelSearchQuery({
        variables: {
            lat: position?.latitude,
            lon: position?.longitude,
            range: MAX_SEARCH_RANGE,
        },
        fetchPolicy: 'cache-and-network',
    })

    const getItems = (query: string): Item[] => {
        const inputValue = query.trim().toLowerCase()
        const inputLength = inputValue.length
        if (!inputLength || !data?.stations) return []

        return mapFeaturesToItems(
            data.stations
                .filter(isNotNullOrUndefined)
                .filter((station) =>
                    getTranslation(station?.name)
                        ?.toLowerCase()
                        .match(new RegExp(inputValue)),
                ),
        )
    }

    const handleOnChange = useCallback(
        (item: Item | null): void => {
            if (item) {
                onSelected(item.value)
            }
        },
        [onSelected],
    )

    return (
        <div className="bike-search">
            <Dropdown
                searchable
                openOnFocus
                label="Ny bysykkelstasjon"
                items={getItems}
                onChange={handleOnChange}
                highlightFirstItemOnOpen
            />
        </div>
    )
}

export { BikePanelSearch }
