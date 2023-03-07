import React, { memo, useState, useCallback } from 'react'
import { fetchAutocomplete } from 'utils/geocoder/fetchAutocomplete'
import { fetchReverse } from 'utils/geocoder/fetchReverse'
import { useLocationPermission } from 'hooks/useLocationPermission'
import { Coordinates } from 'src/types'
import { PositionIcon } from '@entur/icons'
import { Dropdown } from '@entur/dropdown'
import { Button } from '@entur/button'
import classes from './SearchPanel.module.scss'

const YOUR_POSITION = 'Posisjonen din'

type Item = {
    value: string
    label: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icons?: Array<React.ComponentType<any>>
    coordinates?: Coordinates
}

function getErrorMessage(error: GeolocationPositionError): string {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            return 'Du må godta bruk av posisjon i nettleseren før vi kan hente den.'
        default:
            return 'En feil skjedde ved henting av din posisjon'
    }
}

function SearchPanel({ handleCoordinatesSelected }: Props) {
    const locationPermission = useLocationPermission()
    const showPositionInList =
        locationPermission === 'granted' || locationPermission === 'prompt'

    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const [location, setLocation] = useState<{
        name: string
        coords?: Coordinates
    } | null>()

    const [isLoadingYourLocation, setIsLoadingYourLocation] = useState(false)

    const handleSuccessLocation = useCallback(
        (data: GeolocationPosition): void => {
            const coords = {
                latitude: data.coords.latitude,
                longitude: data.coords.longitude,
            }

            fetchReverse(coords).then((name) => {
                if (name) {
                    setLocation({
                        name,
                        coords,
                    })
                }
                setIsLoadingYourLocation(false)
            })
        },
        [],
    )

    const handleDeniedLocation = useCallback(
        (error: GeolocationPositionError): void => {
            setErrorMessage(getErrorMessage(error))
            setLocation(null)
            setIsLoadingYourLocation(false)
        },
        [],
    )

    const onItemSelected = useCallback(
        (item: Item | null): void => {
            if (!item) {
                setLocation(null)
                return
            }

            setErrorMessage(null)
            if (item.value === YOUR_POSITION) {
                setIsLoadingYourLocation(true)
                navigator.geolocation.getCurrentPosition(
                    handleSuccessLocation,
                    handleDeniedLocation,
                    { maximumAge: 60000, timeout: 7500 },
                )
            } else {
                setLocation({
                    name: item.label,
                    coords: item.coordinates,
                })
            }
        },
        [handleDeniedLocation, handleSuccessLocation],
    )

    const handleGoToBoard = useCallback(
        (event: React.FormEvent<HTMLFormElement>): void => {
            event.preventDefault()

            if (!location) setErrorMessage('Ingen stoppested valgt.')
            else if (!location.coords)
                setErrorMessage(
                    'Søket ga ingen resultater. Søk på et navn og velg et stoppested/en bysykkelstasjon fra listen som dukker opp.',
                )
            else {
                handleCoordinatesSelected(location.coords, location.name)
            }
        },
        [handleCoordinatesSelected, location],
    )

    const getItems = useCallback(
        async (query: string): Promise<Item[]> => {
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

            const suggestedFeatures = await fetchAutocomplete(query)
            return [...defaultSuggestions, ...suggestedFeatures]
        },
        [showPositionInList],
    )

    return (
        <form className={classes.SearchPanel} onSubmit={handleGoToBoard}>
            <div className={classes.SearchContainer}>
                <div className={classes.InputContainer}>
                    <Dropdown
                        clearable
                        searchable
                        openOnFocus
                        debounceTimeout={500}
                        label="Søk på avreisested"
                        items={getItems}
                        onChange={onItemSelected}
                        variant={errorMessage ? 'error' : undefined}
                        feedback={errorMessage || ''}
                        highlightFirstItemOnOpen
                    />
                </div>
                <Button
                    variant="primary"
                    size="medium"
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

type Props = {
    handleCoordinatesSelected: (
        choseCoord: Coordinates,
        locationName: string,
    ) => void
}

export { MemoizedSearchPanel as SearchPanel }
