import React, { useCallback, useState } from 'react'
import { Dropdown } from '@entur/dropdown'
import { getTranslation } from '../../../../../utils/utils'
import {
    BikePanelSearchStationFragment,
    useBikePanelSearchQuery,
} from '../../../../../../graphql-generated/mobility-v2'
import { isNotNullOrUndefined } from '../../../../../utils/typeguards'
import { useSettings } from '../../../../../settings/SettingsProvider'
import classes from './BikePanelSearch.module.scss'

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

const BikePanelSearch: React.FC = () => {
    const [settings, setSettings] = useSettings()

    const { data } = useBikePanelSearchQuery({
        variables: {
            lat: settings.coordinates.latitude,
            lon: settings.coordinates.longitude,
            range: MAX_SEARCH_RANGE,
        },
        fetchPolicy: 'cache-and-network',
    })
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const getItems = useCallback(
        (query: string): Item[] => {
            const inputValue = query.trim().toLowerCase()
            const inputLength = inputValue.length
            if (!inputLength || !data?.stations) {
                setErrorMessage(null)
                return []
            }

            const items = mapFeaturesToItems(
                data.stations
                    .filter(isNotNullOrUndefined)
                    .filter((station) =>
                        getTranslation(station?.name)
                            ?.toLowerCase()
                            .match(new RegExp(inputValue)),
                    ),
            )

            if (items.length === 0) {
                setErrorMessage(
                    'Søket ga ingen resultater. Søk på et navn og velg et stoppested/en bysykkelstasjon fra listen som dukker opp.',
                )
            }
            return items
        },
        [data?.stations],
    )

    const addNewStation = useCallback(
        (stationId: string) => {
            if (settings.newStations.includes(stationId)) return
            setSettings({
                newStations: [...settings.newStations, stationId],
            })
        },
        [settings.newStations, setSettings],
    )

    const handleOnChange = useCallback(
        (item: Item | null): void => {
            if (item) {
                setErrorMessage(null)

                addNewStation(item.value)
            }
        },
        [addNewStation],
    )

    return (
        <div className={classes.BikeSearch}>
            <Dropdown
                searchable
                openOnFocus
                clearable
                label="Legg til en bysykkelstasjon"
                items={getItems}
                onChange={handleOnChange}
                highlightFirstItemOnOpen
                variant={errorMessage ? 'error' : undefined}
                feedback={errorMessage || ''}
                value=""
            />
        </div>
    )
}

export { BikePanelSearch }
