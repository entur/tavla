import React, { useState, useEffect } from 'react'
import ReactAutosuggest from 'react-autosuggest'
import { Coordinates, BikeRentalStation } from '@entur/sdk'

import service from '../../../service'

import './styles.scss'

const BikePanelSearch = ({ onSelected, position }: Props): JSX.Element => {
    const [value, setValue] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [stations, setStations] = useState([])

    useEffect(() => {
        service
            .getBikeRentalStationsByPosition(position, 100000)
            .then(newStations => {
                setStations(newStations)
            })
    }, [position])

    const getSuggestions = (newValue: string): Array<BikeRentalStation> => {
        const inputValue = newValue.trim().toLowerCase()
        const inputLength = inputValue.length

        if (!inputLength) return []

        return stations.filter(
            station =>
                station.name.toLowerCase().slice(0, inputLength) === inputValue,
        )
    }

    const onChange = (
        event: React.FormEvent<HTMLButtonElement>,
        changeEvent: ReactAutosuggest.ChangeEvent,
    ): void => {
        const { newValue } = changeEvent
        setValue(newValue)
    }

    const onSuggestionSelected = (_, { suggestion }): void => {
        onSelected(suggestion.id)
    }

    const getSuggestionValue = (suggestion: BikeRentalStation): string =>
        suggestion.name

    const renderSuggestion = (suggestion: BikeRentalStation): JSX.Element => (
        <div>{suggestion.name}</div>
    )

    const onSuggestionsFetchRequested = ({
        value: newValue,
    }: {
        value: string
    }): void => {
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
        <div className="bike-search">
            <span>Bysykkelstativ</span>
            <ReactAutosuggest
                id="BikePanelSearch"
                suggestions={suggestions}
                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                onSuggestionSelected={onSuggestionSelected}
                onSuggestionsClearRequested={onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
            />
        </div>
    )
}

interface Props {
    onSelected: (stationId: string) => void
    position: Coordinates
}

export default BikePanelSearch
