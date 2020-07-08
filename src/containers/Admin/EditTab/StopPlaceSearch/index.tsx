import React from 'react'
import { Coordinates, Feature } from '@entur/sdk'
import { Dropdown } from '@entur/dropdown'

import service from '../../../../service'

import './styles.scss'

interface Item {
    value: string
    label: string
    coordinates?: Coordinates
}

function mapFeaturesToItems(features: Feature[]): Item[] {
    return features.map(({ geometry, properties: { id, name, locality } }) => {
        return {
            value: id,
            label: locality ? `${name}, ${locality}` : name,
            coordinates: {
                longitude: geometry.coordinates[0],
                latitude: geometry.coordinates[1],
            },
        }
    })
}

async function getItems(query: string): Promise<Item[]> {
    if (!query.trim().length) return []

    const featuresData = await service.getFeatures(query, undefined, {
        layers: ['venue'],
    })
    return mapFeaturesToItems(featuresData)
}

const SelectionPanelSearch = ({ handleAddNewStop }: Props): JSX.Element => {
    const onItemSelected = (item: Item | null): void => {
        if (item) {
            handleAddNewStop(item.value)
        }
    }

    return (
        <div className="stop-place-search">
            <span>Stoppested</span>
            <Dropdown
                searchable
                openOnFocus
                debounceTimeout={500}
                placeholder="Søk på stoppested for å legge til"
                items={getItems}
                onChange={onItemSelected}
            />
        </div>
    )
}

interface Props {
    handleAddNewStop: (stopId: string) => void
}

export default SelectionPanelSearch
