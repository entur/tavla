import React, { useState, useEffect } from 'react'
import ReactAutosuggest from 'react-autosuggest'
import { Coordinates, BikeRentalStation } from '@entur/sdk'

import service from '../../../service'

import './styles.scss'

const BikePanelSearch = ({ handleAddNewStations, position }: Props): JSX.Element => {
    const [value, setValue] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [stations, setStations] = useState([])

    useEffect(() => {
        service.getBikeRentalStations(position, 100000).then(newStations => {
            setStations(newStations)
        })
    }, [position])

    const getSuggestions = (newValue: string): Array<BikeRentalStation> => {
        const inputValue = newValue.trim().toLowerCase()
        const inputLength = inputValue.length

        return inputLength === 0
            ? []
            : stations.filter(
                station => station.name.toLowerCase().slice(0, inputLength) === inputValue,
            )
    }

    const onChange = (event: React.FormEvent<HTMLButtonElement>, { newValue, method }: ReactAutosuggest.ChangeEvent): void => {
        if (method === 'click') {
            setValue('')
            handleAddNewStations(getSuggestions(newValue))
        } else {
            setValue(newValue)
        }
    }

    const getSuggestionValue = (suggestion: BikeRentalStation): string => suggestion.name

    const renderSuggestion = (suggestion: BikeRentalStation): JSX.Element => <div>{suggestion.name}</div>

    const onSuggestionsFetchRequested = ({ value: newValue }: { value: string }): void => {
        setSuggestions(getSuggestions(newValue))
    }

    const onSuggestionsClearRequested = (): void => {
        setSuggestions([])
    }

    const inputProps: ReactAutosuggest.InputProps<BikeRentalStation> = {
        placeholder: 'Søk på bysykkelstativ for å legge til',
        value,
        onChange,
    }

    return (
        <div className="input-container-admin">
            <p className="searchPanel-label">Bysykkelstativ</p>
            <ReactAutosuggest
                id="BikePanelSearch"
                suggestions={suggestions}
                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                onSuggestionsClearRequested={onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
            />
        </div>
    )
}

interface Props {
    handleAddNewStations: (stations: Array<BikeRentalStation>) => void,
    position: Coordinates,
}

export default BikePanelSearch
