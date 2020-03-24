import React, { memo, useState, useEffect } from 'react'
import { Button } from '@entur/button'
import { Coordinates, Feature } from '@entur/sdk'
import { Dropdown } from '@entur/dropdown'

import service from '../../../service'
import { useLocationPermission } from '../../../hooks'
import './styles.scss'

const YOUR_POSITION = 'Posisjonen din'

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

function getErrorMessage(error): string {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            return 'Du må godta bruk av posisjon i nettleseren før vi kan hente den.'
        default:
            return 'En feil skjedde ved henting av din posisjon'
    }
}

const SearchPanel = ({ handleCoordinatesSelected }: Props): JSX.Element => {
    console.count('render searchpanel')

    const [{ denied }, refreshLocationPermission] = useLocationPermission()

    const [showPositionInList, setShowPositionInList] = useState(true)

    useEffect(() => {
        if (denied) {
            setShowPositionInList(false)
        }
    }, [denied])

    const [errorMessage, setErrorMessage] = useState(null)

    const [location, setLocation] = useState({
        hasLocation: false,
        selectedLocationName: null,
    })

    const [chosenCoord, setChosenCoord] = useState<Coordinates | null>(null)

    const getAddressFromPosition = (position: Coordinates): void => {
        setChosenCoord(position)
        setLocation({
            hasLocation: true,
            selectedLocationName: YOUR_POSITION,
        })
    }

    const handleSuccessLocation = (data: Position): void => {
        refreshLocationPermission()
        const position = {
            latitude: data.coords.latitude,
            longitude: data.coords.longitude,
        }
        getAddressFromPosition(position)
    }

    const handleDeniedLocation = (error): void => {
        refreshLocationPermission()
        setErrorMessage(getErrorMessage(error))
        setLocation({
            hasLocation: false,
            selectedLocationName: null,
        })
    }

    const onItemSelected = (item: Item): void => {
        if (item.value === YOUR_POSITION) {
            setLocation(previousLocation => ({
                ...previousLocation,
                selectedLocationName: YOUR_POSITION,
            }))

            navigator.geolocation.getCurrentPosition(
                handleSuccessLocation,
                handleDeniedLocation,
            )
        } else {
            setChosenCoord(item.coordinates)
            setLocation({
                hasLocation: true,
                selectedLocationName: item.label,
            })
        }
    }

    const handleGoToBoard = (event): void => {
        event.preventDefault()
        if (chosenCoord) {
            handleCoordinatesSelected(chosenCoord)
        }
    }

    const getItems = async (query: string): Promise<Item[]> => {
        const defaultSuggestions = showPositionInList
            ? [{ value: YOUR_POSITION, label: YOUR_POSITION }]
            : []

        if (!query) {
            return defaultSuggestions
        }

        const featuresData = await service.getFeatures(query)
        const suggestedFeatures = mapFeaturesToItems(featuresData)
        return [...defaultSuggestions, ...suggestedFeatures]
    }

    return (
        <form className="search-panel" onSubmit={handleGoToBoard}>
            <div className="search-container">
                <div className="input-container">
                    <span>Område</span>
                    <div className="input-spinner-container">
                        <Dropdown
                            searchable
                            openOnFocus
                            debounceTimeout={500}
                            placeholder="Adresse eller sted"
                            items={getItems}
                            onChange={onItemSelected}
                        />
                    </div>
                </div>
                <Button
                    variant="primary"
                    className="search-panel__submit-button"
                    type="submit"
                    disabled={!location.hasLocation}
                >
                    Opprett tavle
                </Button>
            </div>
            {errorMessage && (
                <p role="alert" style={{ color: 'red', textAlign: 'center' }}>
                    {errorMessage}
                </p>
            )}
        </form>
    )
}

interface Props {
    handleCoordinatesSelected: (choseCoord: Coordinates | null) => void
}

export default memo(SearchPanel)
