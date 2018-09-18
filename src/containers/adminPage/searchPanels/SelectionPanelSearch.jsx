import React from 'react'
import ReactAutosuggest from 'react-autosuggest'
import {
    getStopPlacesByPositionAndDistance,
    getStopsWithUniqueStopPlaceDepartures,
} from '../../../utils'
import './styles.scss'

class SelectionPanelSearch extends React.Component {
    constructor() {
        super()
        this.state = {
            value: '',
            suggestions: [],
            stops: [],
        }
    }

    onChange = (event, { newValue, method }) => {
        if (method === 'click') {
            this.setState({
                value: '',
            })
            const stop = this.state.stops.filter(item => { return item.name === newValue })[0]
            getStopsWithUniqueStopPlaceDepartures([stop]).then(data => {
                this.props.handleAddNewStop(data[0])
            })
        } else {
            this.setState({
                value: newValue,
            })
        }
    };

    componentDidMount() {
        getStopPlacesByPositionAndDistance(this.props.position, 10000)
            .then(stops => {
                this.setState({ stops })
            })
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
        this.setState({
            suggestions: this.getSuggestions(value),
        })
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: [],
        })
    };

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
                    renderSuggestion={this.renderSuggestion}
                    inputProps={inputProps}
                />
            </div>
        )
    }
}

export default SelectionPanelSearch
