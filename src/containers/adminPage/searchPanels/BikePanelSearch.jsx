import React, { useState, useEffect } from 'react'
import ReactAutosuggest from 'react-autosuggest'
import service from '../../../service'
import './styles.scss'

const BikePanelSearch = ({ handleAddNewStation, position }) => {
    const [value, setValue] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [stations, setStations] = useState([])

    useEffect(() => {
        service.getBikeRentalStations(position, 100000).then(newStations => {
            setStations(newStations)
        })
    }, [service, position, setStations])

    const getSuggestions = newValue => {
        const inputValue = newValue.trim().toLowerCase()
        const inputLength = inputValue.length

        return inputLength === 0
            ? []
            : stations.filter(
                station => station.name.toLowerCase().slice(0, inputLength) === inputValue,
            )
    }

    const onChange = (_, { newValue, method }) => {
        if (method === 'click') {
            setValue('')
            handleAddNewStation(getSuggestions(newValue))
        } else {
            setValue(newValue)
        }
    }

    const getSuggestionValue = suggestion => suggestion.name

    const renderSuggestion = suggestion => <div>{suggestion.name}</div>

    const onSuggestionsFetchRequested = ({ value: newValue }) => {
        setSuggestions(getSuggestions(newValue))
    }

    const onSuggestionsClearRequested = () => {
        setSuggestions([])
    }

    const inputProps = {
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

export default BikePanelSearch
