import React, { useState } from 'react'
import ReactAutosuggest from 'react-autosuggest'
import debounce from 'lodash.debounce'

import service from '../../../service'
import './styles.scss'

const SelectionPanelSearch = ({ handleAddNewStop }) => {
    const [value, setValue] = useState('')
    const [suggestions, setSuggestions] = useState([])

    const onChange = (_, { newValue, method }) => {
        if (method === 'click') {
            setValue('')
        } else {
            setValue(newValue)
        }
    }

    /* const getSuggestions = value => {
        const inputValue = value.trim().toLowerCase()
        const inputLength = inputValue.length

        return inputLength === 0
            ? []
            : stops.filter(
                  stop =>
                      stop.name.toLowerCase().slice(0, inputLength) ===
                      inputValue
              )
    } */

    const getSuggestionValue = suggestion => suggestion.name

    const renderSuggestion = suggestion => <div>{suggestion.name}</div>

    const getFeaturesDebounced = debounce(newValue => {
        const inputLength = newValue.trim().length

        if (inputLength > 0) {
            service.getFeatures(value, undefined, { layers: 'venue' }).then(featuresData => {
                const features = featuresData.map(
                    ({ geometry, properties: { id, name, locality } }) => {
                        return {
                            coordinates: {
                                longitude: geometry.coordinates[0],
                                latitude: geometry.coordinates[1],
                            },
                            id,
                            name: `${name}, ${locality}`,
                        }
                    },
                )
                setSuggestions(features)
            })
        }
    }, 500)

    const onSuggestionsFetchRequested = ({ value: newValue }) => {
        getFeaturesDebounced(newValue)
    }

    const onSuggestionSelected = (_, { suggestion }) => {
        service.getStopPlace(suggestion.id).then(stop => {
            service
                .getStopPlaceDepartures(stop.id, {
                    includeNonBoarding: true,
                    departures: 50,
                })
                .then(departures => {
                    const updatedStop = {
                        ...stop,
                        departures,
                    }
                    handleAddNewStop(updatedStop)
                })
        })
    }

    const onSuggestionsClearRequested = () => {
        setSuggestions([])
    }

    const inputProps = {
        placeholder: 'Søk på stoppested for å legge til',
        value,
        onChange,
    }

    return (
        <div className="input-container-admin">
            <p className="searchPanel-label">Stoppested</p>
            <ReactAutosuggest
                id="SelectionPanelSearch"
                suggestions={suggestions}
                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                onSuggestionsClearRequested={onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                onSuggestionSelected={onSuggestionSelected}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
            />
        </div>
    )
}

export default SelectionPanelSearch
