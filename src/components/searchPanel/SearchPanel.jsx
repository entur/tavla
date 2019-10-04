import React, { useState, useEffect } from 'react'
import debounce from 'lodash.debounce'
import ReactAutosuggest from 'react-autosuggest'
import { Button } from '@entur/component-library'

import { Spinner, GeoLocation } from '../../assets/icons'
import service from '../../service'
import './styles.scss'

const YOUR_POSITION = 'Posisjonen din'

function getSuggestionValue(suggestion) {
    return suggestion.name
}

function renderSuggestion(suggestion) {
    if (suggestion.name === YOUR_POSITION) {
        return (
            <span>
                {suggestion.name}
                <span className="location-icon">
                    <GeoLocation height={15} width={15} />
                </span>
            </span>
        )
    }
    return <span>{suggestion.name}</span>
}

const SearchPanel = ({ handleCoordinatesSelected }) => {
    const [formValue, setFormValue] = useState({
        value: '',
        errorMessage: null,
    })
    const [suggestions, setSuggestions] = useState([{ name: YOUR_POSITION }])

    const [location, setLocation] = useState({
        hasLocation: false,
        selectedLocationName: null,
    })

    const [waiting, setWaiting] = useState(false)
    const [showPositionInList, setShowPositionInList] = useState(true)
    const [chosenCoord, setChosenCoord] = useState(null)

    useEffect(() => {
        if (!navigator || !navigator.permissions) return
        navigator.permissions.query({ name: 'geolocation' }).then(permission => {
            const newSuggestions = suggestions.filter(s => s.name !== YOUR_POSITION)
            if (permission.state === 'denied') {
                setShowPositionInList(false)
                setSuggestions(newSuggestions)
            } else {
                setSuggestions([{ name: YOUR_POSITION }, ...newSuggestions])
            }
        })
    }, [suggestions, setShowPositionInList, setSuggestions])

    const onChange = (_, { newValue }) => {
        setFormValue({
            value: newValue,
            errorMessage: null,
        })
    }

    const getFeaturesDebounced = debounce(value => {
        const inputLength = value.trim().length

        if (inputLength > 0) {
            service.getFeatures(value).then(featuresData => {
                const suggestedFeatures = featuresData.map(
                    ({ geometry, properties: { name, locality } }) => {
                        return {
                            coordinates: {
                                lon: geometry.coordinates[0],
                                lat: geometry.coordinates[1],
                            },
                            name: `${name}, ${locality}`,
                        }
                    },
                )

                const features = showPositionInList
                    ? [{ name: YOUR_POSITION }, ...suggestedFeatures]
                    : suggestedFeatures

                setSuggestions(features)
            })
        }
    }, 500)

    const onSuggestionsFetchRequested = ({ value }) => {
        if (value !== location.selectedLocationName) {
            setLocation({
                hasLocation: false,
                selectedLocationName: null,
            })

            setChosenCoord(null)
        }
        getFeaturesDebounced(value)
    }

    const getAddressFromPosition = position => {
        setFormValue({
            value: YOUR_POSITION,
            errorMessage: null,
        })

        setChosenCoord(position)

        setLocation({
            hasLocation: true,
            selectedLocationName: YOUR_POSITION,
        })
    }

    const onSuggestionsClearRequested = () => {
        const newSuggestions = showPositionInList ? [{ name: YOUR_POSITION }] : []

        setSuggestions(newSuggestions)
    }

    const handleSuccessLocation = data => {
        const position = { lat: data.coords.latitude, lon: data.coords.longitude }
        getAddressFromPosition(position)

        setWaiting(false)
    }

    const getErrorMessage = error => {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                return 'Du må godta bruk av posisjon i nettleseren før vi kan hente den.'
            default:
                return 'En feil skjedde ved henting av din posisjon'
        }
    }

    const handleDeniedLocation = error => {
        setFormValue({
            value: '',
            errorMessage: getErrorMessage(error),
        })

        setSuggestions([])

        setLocation({
            hasLocation: false,
            selectedLocationName: null,
        })

        setShowPositionInList(false)

        setWaiting(false)

        console.log('Permission denied with error: ', error) // eslint-disable-line
    }

    const onSuggestionSelected = (_, { suggestion }) => {
        if (suggestion.name === YOUR_POSITION) {
            setWaiting(true)

            setLocation(v => ({
                ...v,
                selectedLocationName: YOUR_POSITION,
            }))

            navigator.geolocation.getCurrentPosition(handleSuccessLocation, handleDeniedLocation)
        } else {
            setChosenCoord(suggestion.coordinates)
            setLocation({
                hasLocation: true,
                selectedLocationName: suggestion.name,
            })
        }
    }

    const handleGoToBoard = event => {
        event.preventDefault()

        return chosenCoord ? handleCoordinatesSelected(chosenCoord) : null
    }

    const renderSpinner = () => {
        return (
            <div className="spinner-container">
                <Spinner className="spinner" />
            </div>
        )
    }

    const { errorMessage, value } = formValue
    const inputProps = {
        placeholder: 'Adresse eller sted',
        value,
        onChange,
        onFocus: () => {
            setFormValue(v => ({
                ...v,
                errorMessage: null,
            }))
        },
    }

    return (
        <form className="search-panel" onSubmit={handleGoToBoard}>
            <div className="search-container">
                <div className="input-container">
                    <span className="searchPanel-label">Område</span>
                    <div className="input-spinner-container">
                        <ReactAutosuggest
                            suggestions={suggestions}
                            shouldRenderSuggestions={() => true}
                            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                            onSuggestionsClearRequested={onSuggestionsClearRequested}
                            onSuggestionSelected={onSuggestionSelected}
                            getSuggestionValue={getSuggestionValue}
                            renderSuggestion={renderSuggestion}
                            inputProps={inputProps}
                        />
                        {waiting && renderSpinner()}
                    </div>
                </div>
                <Button
                    className="search-panel__submit-button"
                    type="submit"
                    disabled={!location.hasLocation}
                >
                    Opprett tavle
                </Button>
            </div>
            {errorMessage && (
                <p role="alert" style={{ color: 'red' }}>
                    {errorMessage}
                </p>
            )}
        </form>
    )
}

export default SearchPanel
