import React, { useState, useEffect } from 'react'
import ReactAutosuggest from 'react-autosuggest'

import service from '../../../service'
import { useDebounce, mapFeaturesToSuggestions, Suggestion } from '../../../utils'

import './styles.scss'

async function fetchSuggestions(value: string): Promise<Array<Suggestion>> {
    if (!value.trim().length) return []

    const featuresData = await service.getFeatures(value, undefined, { layers: ['venue'] })
    return mapFeaturesToSuggestions(featuresData)
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
