import React, { memo, useState, useEffect } from 'react'
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

type Location = {
    hasLocation: boolean
    selectedLocationName: string | null
}

function SearchPanel({ handleCoordinatesSelected }: Props) {
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
        fetchReverse(position).then((locationName) => {
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
            setErrorMessage(
                'Søket ga ingen resultater. Søk på et navn og velg et stoppested/en bysykkelstasjon fra listen som dukker opp.',
            )
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

        const suggestedFeatures = await fetchAutocomplete(query)
        return [...defaultSuggestions, ...suggestedFeatures]
    }

    return (
        <form className={classes.SearchPanel} onSubmit={handleGoToBoard}>
            <div className={classes.SearchContainer}>
                <div className={classes.InputContainer}>
                    <Dropdown
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
