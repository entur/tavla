import React from 'react'
import ReactAutosuggest from 'react-autosuggest'
import debounce from 'lodash.debounce'

import service from '../../../service'
import './styles.scss'

class SelectionPanelSearch extends React.Component {
    constructor() {
        super()
        this.state = {
            value: '',
            suggestions: [],
        }
    }

    onChange = (event, { newValue, method }) => {
        if (method === 'click') {
            this.setState({
                value: '',
            })
        } else {
            this.setState({
                value: newValue,
            })
        }
    }

    getSuggestions = (value) => {
        const inputValue = value.trim().toLowerCase()
        const inputLength = inputValue.length

        return inputLength === 0 ? [] : this.state.stops.filter(stop => stop.name.toLowerCase().slice(0, inputLength) === inputValue)
    }

    getSuggestionValue = (suggestion) => suggestion.name

    renderSuggestion = (suggestion) => (
        <div>
            {suggestion.name}
        </div>
    )

    onSuggestionsFetchRequested = ({ value }) => {
        this.getFeaturesDebounced(value)
    };

    onSuggestionSelected = (event, { suggestion }) => {
        const coordinates = {
            latitude: suggestion.coordinates.lat,
            longitude: suggestion.coordinates.lon,
        }

        service.getStopPlacesByPosition(coordinates, 10).then(stop => {
            service.getStopPlaceDepartures(stop[0].id, { onForBoarding: true, departures: 50 })
                .then(departures => {
                    const updatedStop = {
                        ...stop[0],
                        departures,
                    }
                    this.props.handleAddNewStop(updatedStop)
                })
        })
    }

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: [],
        })
    };

    getFeaturesDebounced = debounce((value) => {
        const inputLength = value.trim().length

        if (inputLength > 0) {
            service.getFeatures(value).then(featuresData => {
                const features = featuresData.map(({ geometry, properties }) => {
                    return {
                        coordinates: {
                            lon: geometry.coordinates[0],
                            lat: geometry.coordinates[1],
                        },
                        name: properties.name + ', ' + properties.locality,
                    }
                })
                this.setState({
                    suggestions: features,
                })
            })
        }
    }, 500)

    render() {
        const { value, suggestions } = this.state
        const inputProps = {
            placeholder: 'Søk på stoppested for å legge til',
            value,
            onChange: this.onChange,
        }

        return (
            <div className="input-container-admin">
                <p className="searchPanel-label">Stoppested</p>
                <ReactAutosuggest
                    id="SelectionPanelSearch"
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={this.getSuggestionValue}
                    onSuggestionSelected={this.onSuggestionSelected}
                    renderSuggestion={this.renderSuggestion}
                    inputProps={inputProps}
                />
            </div>
        )
    }
}

export default SelectionPanelSearch
