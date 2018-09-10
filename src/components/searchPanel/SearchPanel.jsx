import React from 'react'
import debounce from 'lodash.debounce'
import ReactAutosuggest from 'react-autosuggest'
import { Spinner, GeoLocation } from '../../assets/icons'
import service from '../../service'
import './styles.scss'

const YOUR_POSITION = 'Din posisjon'

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
        showPositionInList: true,
        selectedLocationName: '',
    }

    componentDidMount() {
        navigator.permissions.query({ name: 'geolocation' })
            .then(permission => {
                if (permission.state === 'denied') {
                    this.setState({
                        showPositionInList: false,
                    })
                }
            })
    }

    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue,
        })
    };

    onSuggestionsFetchRequested = ({ value }) => {
        if (value !== this.state.selectedLocationName) {
            this.setState({
                hasLocation: false,
                selectedLocationName: '',
                chosenCoord: '',
            })
        }
        this.getFeaturesDebounced(value)
    };

    getFeaturesDebounced = debounce((value) => {
        const inputLength = value.trim().length

        if (inputLength > 0) {
            service.getFeatures(value).then(featuresData => {
                const suggestedFeatures = featuresData.map(({ geometry, properties }) => {
                    return {
                        coordinates: {
                            lon: geometry.coordinates[0],
                            lat: geometry.coordinates[1],
                        },
                        name: properties.name + ', ' + properties.locality,
                    }
                })

                const features = this.state.showPositionInList
                    ? [{ name: YOUR_POSITION }, ...suggestedFeatures] : suggestedFeatures
                this.setState({
                    suggestions: features,
                })
            })
        }
    }, 500)

    getAddressFromPosition = (position) => {
        this.setState({
            value: YOUR_POSITION,
            chosenCoord: position,
            hasLocation: true,
            suggestions: [],
            selectedLocationName: position.name,
        })
    }

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: [],
        })
    }

    onSuggestionSelected = (event, { suggestion }) => {
        if (suggestion.name === YOUR_POSITION) {
            this.handleGetLocation()
        } else {
            this.setState({
                chosenCoord: suggestion.coordinates,
                hasLocation: true,
                selectedLocationName: suggestion.name,
            })
        }
    }

    handleGetLocation = () => {
        this.setState({
            waiting: true,
        })
        navigator.geolocation.getCurrentPosition(this.handleSuccessLocation, this.handleDeniedLocation)
    }

    handleSuccessLocation = (data) => {
        const position = { lat: data.coords.latitude, lon: data.coords.longitude }
        this.getAddressFromPosition(position)
        this.setState({
            waiting: false,
        })
    }

    handleDeniedLocation = (error) => {
        if (error.code === error.PERMISSION_DENIED) {
            this.setState({
                value: '',
                suggestions: [],
                hasLocation: false,
                waiting: false,
                showPositionInList: false,
                selectedLocationName: '',
            })
            console.log('Permission denied with error: ', error) // eslint-disable-line
        }
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
            placeholder: 'Adresse eller sted',
            value,
            onChange: this.onChange,
        }

        const btnClass = !this.state.hasLocation ? 'landing-Button--location-false' : 'landing-button--location-true'

        return (
            <div className="search-container">

                <div className="input-container">
                    <p className="searchPanel-label">Område</p>
                    <ReactAutosuggest
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                        onSuggestionSelected={this.onSuggestionSelected}
                        getSuggestionValue={getSuggestionValue}
                        renderSuggestion={renderSuggestion}
                        inputProps={inputProps}
                    />
                    {this.state.waiting && this.renderSpinner()}
                </div>
                <button className={'landing-button ' + btnClass} onClick={this.handleGoToBoard}>Opprett tavle</button>
            </div>
        )
    }
}

export default SearchPanel
