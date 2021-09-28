import React, { useState, useEffect } from 'react'

import { Coordinates } from '@entur/sdk'
import { Dropdown } from '@entur/dropdown'
import { Station } from '@entur/sdk/lib/mobility/types'

import service from '../../../../service'

import './styles.scss'
import { getTranslation } from '../../../../utils'

const MAX_SEARCH_RANGE = 100_000

interface Item {
    value: string
    label: string
}

function mapFeaturesToItems(features: Station[]): Item[] {
    return features.map(({ id, name }) => ({
        value: id,
        label: getTranslation(name) || '',
    }))
}

const BikePanelSearch = ({ onSelected, position }: Props): JSX.Element => {
    const [stations, setStations] = useState<Station[]>([])

    useEffect(() => {
        const controller = new AbortController()
        if (position) {
            service.mobility
                .getStations(
                    {
                        lat: position.latitude,
                        lon: position.longitude,
                        range: MAX_SEARCH_RANGE,
                    },
                    {
                        signal: controller.signal,
                    },
                )
                .then((data) => {
                    setStations(data)
                })
                .catch((err) => {
                    if (!controller.signal.aborted) {
                        throw err
                    }
                })
        }
        return () => {
            controller.abort()
        }
    }, [position])

    const getItems = (query: string): Item[] => {
        const inputValue = query.trim().toLowerCase()
        const inputLength = inputValue.length
        if (!inputLength) return []

        return mapFeaturesToItems(
            stations.filter((station) =>
                getTranslation(station.name)
                    ?.toLowerCase()
                    .match(new RegExp(inputValue)),
            ),
        )
    }

    const onItemSelected = (item: Item | null): void => {
        if (item) {
            onSelected(item.value)
        }
    }

    return (
        <div className="bike-search">
            <Dropdown
                searchable
                openOnFocus
                placeholder="Søk på bysykkelstativ for å legge til"
                items={getItems}
                onChange={onItemSelected}
                highlightFirstItemOnOpen
            />
        </div>
    )
}

interface Props {
    onSelected: (stationId: string) => void
    position: Coordinates | undefined
}

export default BikePanelSearch
