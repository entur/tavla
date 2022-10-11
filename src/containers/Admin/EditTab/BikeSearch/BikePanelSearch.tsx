import React, { useState, useEffect } from 'react'
// Workaround for incompatible AbortSignal types between lib.dom and @entur/sdk
import { AbortSignal as AbortSignalNodeFetch } from 'node-fetch/externals'
import { Coordinates } from '@entur/sdk'
import { Dropdown } from '@entur/dropdown'
import { Station } from '@entur/sdk/lib/mobility/types'
import { enturClient } from '../../../../service'
import { createAbortController, getTranslation } from '../../../../utils'
import './BikePanelSearch.scss'

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
        const controller = createAbortController()
        if (position) {
            enturClient.mobility
                .getStations(
                    {
                        lat: position.latitude,
                        lon: position.longitude,
                        range: MAX_SEARCH_RANGE,
                    },
                    {
                        signal: controller.signal as AbortSignalNodeFetch,
                    },
                )
                .then((data) => {
                    setStations(data)
                })
                .catch((err) => {
                    if (!controller.signal?.aborted) {
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
                label="Ny bysykkelstasjon"
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

export { BikePanelSearch }
