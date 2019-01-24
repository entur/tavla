import React from 'react'
import debounce from 'lodash.debounce'
import ReactAutosuggest from 'react-autosuggest'
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
    return (
        <span>{suggestion.name}</span>
    )
}


class SearchPanel extends React.Component {
    state = {
        value: '',
        suggestions: [{ name: YOUR_POSITION }],
        hasLocation: false,
        waiting: false,
        showPositionInList: true,
        selectedLocationName: '',
    }

    componentDidMount() {
        if (!navigator || !navigator.permissions) return
        navigator.permissions.query({ name: 'geolocation' })
            .then(permission => {
                const suggestions = this.state.suggestions.filter(s => s.name !== YOUR_POSITION)
                if (permission.state === 'denied') {
                    this.setState({
                        showPositionInList: false,
                        suggestions,
                    })
                } else {
                    this.setState({
                        suggestions: [{ name: YOUR_POSITION }, ...suggestions],
                    })
                }
            })
    }

    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue,
            errorMessage: undefined,
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
            selectedLocationName: YOUR_POSITION,
        })
    }

    onSuggestionsClearRequested = () => {
        const { showPositionInList } = this.state

        this.setState({
            suggestions: showPositionInList ? [{ name: YOUR_POSITION }] : [],
        })
    }

    onSuggestionSelected = (event, { suggestion }) => {
        if (suggestion.name === YOUR_POSITION) {
            this.setState({
                selectedLocationName: YOUR_POSITION,
                waiting: true,
            })
            navigator.geolocation.getCurrentPosition(this.handleSuccessLocation, this.handleDeniedLocation)
        } else {
            this.setState({
                chosenCoord: suggestion.coordinates,
                hasLocation: true,
                selectedLocationName: suggestion.name,
            })
        }
    }

    handleSuccessLocation = (data) => {
        const position = { lat: data.coords.latitude, lon: data.coords.longitude }
        this.getAddressFromPosition(position)
        this.setState({
            waiting: false,
        })
    }

    handleDeniedLocation = (error) => {
        this.setState({
            value: '',
            suggestions: [],
            hasLocation: false,
            waiting: false,
            showPositionInList: false,
            selectedLocationName: '',
            errorMessage: this.getErrorMessage(error),
        })
        console.log('Permission denied with error: ', error) // eslint-disable-line
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

    getErrorMessage = (error) => {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                return 'Du må godta bruk av posisjon i nettleseren før vi kan hente den.'
            default:
                return 'En feil skjedde ved henting av din posisjon'
        }
    }

    render() {
        const { value, suggestions, errorMessage } = this.state
        const inputProps = {
            placeholder: 'Adresse eller sted',
            value,
            onChange: this.onChange,
            onFocus: () => {
                this.setState({
                    errorMessage: undefined,
                })
            },
        }

        const btnClass = !this.state.hasLocation ? 'landing-button--location-false' : 'landing-button--location-true'

        return (
            <React.Fragment>
                <div className="search-container">
                    <div className="input-container">
                        <p className="searchPanel-label">Område</p>
                        <div className="input-spinner-container">
                            <ReactAutosuggest
                                suggestions={suggestions}
                                shouldRenderSuggestions={() => true}
                                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                onSuggestionSelected={this.onSuggestionSelected}
                                getSuggestionValue={getSuggestionValue}
                                renderSuggestion={renderSuggestion}
                                inputProps={inputProps}
                            />
                            {this.state.waiting && this.renderSpinner()}
                        </div>
                    </div>
                    <button className={'landing-button ' + btnClass} onClick={this.handleGoToBoard}>
                    Opprett tavle
                    </button>
                </div>
                { errorMessage && <p role="alert" style={{ color: 'red' }}>{ errorMessage }</p> }
            </React.Fragment>
        )
    }
}

export default SearchPanel
