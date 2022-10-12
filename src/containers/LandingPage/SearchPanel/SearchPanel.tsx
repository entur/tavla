import React, { memo, useState, useEffect } from 'react'
import { Button } from '@entur/button'
import { Coordinates, Feature, convertFeatureToLocation } from '@entur/sdk'
import { Dropdown } from '@entur/dropdown'
import { PositionIcon } from '@entur/icons'
import { enturClient } from '../../../service'
import { useLocationPermission } from '../../../hooks'
import './SearchPanel.scss'

const YOUR_POSITION = 'Posisjonen din'

interface Item {
    value: string
    label: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icons?: Array<React.ComponentType<any>>
    coordinates?: Coordinates
}

async function getStopPlace(coordinates: {
    latitude: number
    longitude: number
}): Promise<string | undefined> {
    const result = await enturClient.getFeaturesReverse(coordinates, {
        size: 1,
        radius: 1000,
    })
    return result[0] && convertFeatureToLocation(result[0]).name
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

function getErrorMessage(error: GeolocationPositionError): string {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            return 'Du må godta bruk av posisjon i nettleseren før vi kan hente den.'
        default:
            return 'En feil skjedde ved henting av din posisjon'
    }
}

interface Location {
    hasLocation: boolean
    selectedLocationName: string | null
}

const SearchPanel = ({ handleCoordinatesSelected }: Props): JSX.Element => {
    const [{ denied }, refreshLocationPermission] = useLocationPermission()
    const [isLoadingYourLocation, setIsLoadingYourLocation] = useState(false)
    const [showPositionInList, setShowPositionInList] = useState(true)

    useEffect(() => {
        if (denied) {
            setShowPositionInList(false)
        }
    }, [denied])

    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const [location, setLocation] = useState<Location>({
        hasLocation: false,
        selectedLocationName: null,
    })

    const [chosenCoord, setChosenCoord] = useState<Coordinates | null>(null)

    const getAddressFromPosition = (position: Coordinates): void => {
        setChosenCoord(position)
        getStopPlace(position).then((locationName) => {
            if (locationName) {
                setLocation({
                    hasLocation: true,
                    selectedLocationName: locationName,
                })
            }
            setIsLoadingYourLocation(false)
        })
    }

    const handleSuccessLocation = (data: GeolocationPosition): void => {
        refreshLocationPermission()
        const position = {
            latitude: data.coords.latitude,
            longitude: data.coords.longitude,
        }
        getAddressFromPosition(position)
    }

    const handleDeniedLocation = (error: GeolocationPositionError): void => {
        refreshLocationPermission()
        setErrorMessage(getErrorMessage(error))
        setLocation({
            hasLocation: false,
            selectedLocationName: null,
        })
        setIsLoadingYourLocation(false)
    }

    const onItemSelected = (item: Item | null): void => {
        if (!item) return
        setErrorMessage(null)
        if (item.value === YOUR_POSITION) {
            setIsLoadingYourLocation(true)
            navigator.geolocation.getCurrentPosition(
                handleSuccessLocation,
                handleDeniedLocation,
                { maximumAge: 60000, timeout: 7500 },
            )
        } else {
            setChosenCoord(item.coordinates || null)
            setLocation({
                hasLocation: true,
                selectedLocationName: item.label,
            })
        }
    }

    const handleGoToBoard = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault()

        if (chosenCoord && location.selectedLocationName) {
            handleCoordinatesSelected(
                chosenCoord,
                location.selectedLocationName,
            )
        } else {
            setErrorMessage('Du må velge et sted for å lage en avgangstavle.')
        }
    }

    const getItems = async (query: string): Promise<Item[]> => {
        const defaultSuggestions = showPositionInList
            ? [
                  {
                      value: YOUR_POSITION,
                      label: YOUR_POSITION,
                      icons: [PositionIcon],
                  },
              ]
            : []

        if (!query) {
            return defaultSuggestions
        }

        const featuresData = await enturClient.getFeatures(query)
        const suggestedFeatures = mapFeaturesToItems(featuresData)
        return [...defaultSuggestions, ...suggestedFeatures]
    }

    return (
        <form className="search-panel" onSubmit={handleGoToBoard}>
            <div className="search-container">
                <div className="input-container">
                    <div className="input-spinner-container">
                        <Dropdown
                            searchable
                            clearable
                            openOnFocus
                            debounceTimeout={500}
                            label="Avreisested"
                            items={getItems}
                            onChange={onItemSelected}
                            variant={errorMessage ? 'error' : undefined}
                            feedback={errorMessage || ''}
                            highlightFirstItemOnOpen
                        />
                    </div>
                </div>
                <Button
                    variant="primary"
                    size="medium"
                    className="search-panel__submit-button"
                    type="submit"
                    loading={isLoadingYourLocation}
                    disabled={isLoadingYourLocation}
                >
                    Opprett tavle
                </Button>
            </div>
        </form>
    )
}

const MemoizedSearchPanel = memo(SearchPanel)

interface Props {
    handleCoordinatesSelected: (
        choseCoord: Coordinates,
        locationName: string,
    ) => void
}

export { MemoizedSearchPanel as SearchPanel }
