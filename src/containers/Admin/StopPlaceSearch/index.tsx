import React, { useState, useEffect } from 'react'
import ReactAutosuggest from 'react-autosuggest'
import { Coordinates } from '@entur/sdk'

import service from '../../../service'
import { useDebounce } from '../../../utils'

import './styles.scss'

interface Suggestion {
    coordinates: Coordinates,
    id: string,
    name: string,
}

async function fetchSuggestions(value: string): Promise<Array<Suggestion>> {
    if (!value.trim().length) return []

    const featuresData = await service.getFeatures(value, undefined, { layers: ['venue'] })
    return featuresData.map(
        ({ geometry, properties: { id, name, locality } }) => {
            return {
                coordinates: {
                    longitude: geometry.coordinates[0],
                    latitude: geometry.coordinates[1],
                },
                id,
                name: locality ? `${name}, ${locality}` : name,
            }
        },
    )
}

const SelectionPanelSearch = ({ handleAddNewStop }: Props): JSX.Element => {
    const [suggestions, setSuggestions] = useState<Array<Suggestion>>([])
    const [value, setValue] = useState('')
    const debouncedValue = useDebounce(value, 500)

    const onChange = (_, { newValue, method }): void => {
        if (method === 'click') {
            setValue('')
        } else {
            setValue(newValue)
        }
    }

    const getSuggestionValue = (suggestion: Suggestion): string => suggestion.name

    const renderSuggestion = (suggestion: Suggestion): JSX.Element => <div>{suggestion.name}</div>

    useEffect(() => {
        fetchSuggestions(debouncedValue).then(setSuggestions)
    }, [debouncedValue])

    const onSuggestionsFetchRequested = ({ value: newValue }): void => {
        setValue(newValue)
    }

    const onSuggestionSelected = (_, { suggestion }): void => {
        handleAddNewStop(suggestion.id)
    }

    const onSuggestionsClearRequested = (): void => {
        setSuggestions([])
    }

    const inputProps = {
        placeholder: 'Søk på stoppested for å legge til',
        value,
        onChange,
    }

    return (
        <div className="stop-place-search">
            <span>Stoppested</span>
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

interface Props {
    handleAddNewStop: (stopId: string) => void,
}

export default SelectionPanelSearch
