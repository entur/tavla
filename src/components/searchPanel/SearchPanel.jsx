import React from 'react'
import EnturService from '@entur/sdk'
import debounce from 'lodash.debounce'
import ReactAutosuggest from 'react-autosuggest'
import { GeoLocation, Spinner } from '../../assets/icons'
import './styles.scss'

const service = new EnturService({ clientName: 'entur-tavla' })

function getSuggestionValue(suggestion) {
    return suggestion.name
}

function renderSuggestion(suggestion) {
    return (
        <span>{suggestion.name}</span>
    )
}

class SearchPanel extends React.Component {
    state = {
        value: '',
        suggestions: [],
        hasLocation: false,
        waiting: false,
    }

    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue,
        })
    };

    onSuggestionsFetchRequested = ({ value }) => {
        this.getFeaturesDebounced(value)
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

    getAddressFromPosition = (position) => {
        this.setState({
            value: 'Din posisjon',
            chosenCoord: position,
            hasLocation: true,
        })
    }

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: [],
        })
    }

    onSuggestionSelected = (event, { suggestion }) => {
        this.setState({
            chosenCoord: suggestion.coordinates,
            hasLocation: true,
        })
    }

    handleGetLocationClick = () => {
        this.setState({
            waiting: true,
        })
        navigator.geolocation.getCurrentPosition(data => {
            const position = { lat: data.coords.latitude, lon: data.coords.longitude }
            this.getAddressFromPosition(position)
            this.setState({
                waiting: false,
            })
        })
    }

    handleGoToBoard = () => {
        const coordinates = this.state.chosenCoord
        return coordinates ? this.props.handleCoordinatesSelected(coordinates) : null
    }

    renderSpinner = () => {
        return (
            <div className="spinner-container">
                <Spinner className="spinner"/>
            </div>
        )
    }

    render() {
        const { value, suggestions } = this.state
        const inputProps = {
            placeholder: 'f.eks. Osloveien 14, 1234 Oslo',
            value,
            onChange: this.onChange,
        }

        const btnClass = !this.state.hasLocation ? 'location-false ' : 'location-true '

        return (
            <div className="search-container">

                <div className="input-container">
                    Adresse
                    {this.state.waiting && this.renderSpinner()}
                    <ReactAutosuggest
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                        onSuggestionSelected={this.onSuggestionSelected}
                        getSuggestionValue={getSuggestionValue}
                        renderSuggestion={renderSuggestion}
                        inputProps={inputProps}
                    />
                    <span className="get-location-icon" onClick={this.handleGetLocationClick}>
                        <GeoLocation />
                    </span>
                </div>
                <button className={btnClass + 'landing-button'} onClick={this.handleGoToBoard}>Opprett tavle</button>
            </div>
        )
    }
}

export default SearchPanel
