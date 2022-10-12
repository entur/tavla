import React from 'react'
import { Coordinates, Feature } from '@entur/sdk'
import { Dropdown } from '@entur/dropdown'
import { enturClient } from '../../../../service'
import './StopPlaceSearch.scss'

interface Item {
    value: string
    label: string
    coordinates?: Coordinates
}

function mapFeaturesToItems(features: Feature[]): Item[] {
    return features.map(({ geometry, properties: { id, name, locality } }) => ({
        value: id,
        label: locality ? `${name}, ${locality}` : name,
        coordinates: {
            longitude: geometry.coordinates[0],
            latitude: geometry.coordinates[1],
        },
    }))
}

async function getItems(query: string): Promise<Item[]> {
    if (!query.trim().length) return []

    const featuresData = await enturClient.getFeatures(query, undefined, {
        layers: ['venue'],
    })
    return mapFeaturesToItems(featuresData)
}

const StopPlaceSearch = ({ handleAddNewStop }: Props): JSX.Element => {
    const onItemSelected = (item: Item | null): void => {
        if (item) {
            handleAddNewStop(item.value)
        }
    }

    return (
        <div className="stop-place-search">
            <Dropdown
                searchable
                openOnFocus
                debounceTimeout={500}
                label="Nytt stoppested"
                items={getItems}
                onChange={onItemSelected}
                highlightFirstItemOnOpen
            />
        </div>
    )
}

interface Props {
    handleAddNewStop: (stopId: string) => void
}

export { StopPlaceSearch }
