import React from 'react'
import ReactAutosuggest from 'react-autosuggest'
import service from '../../../service'
import './styles.scss'

class BikePanelSearch extends React.Component {
    constructor() {
        super()
        this.state = {
            value: '',
            suggestions: [],
            stations: [],
        }
    }

    onChange = (event, { newValue, method }) => {
        if (method === 'click') {
            this.setState({
                value: '',
            })
            this.props.handleAddNewStation(this.getSuggestions(newValue))
        } else {
            this.setState({
                value: newValue,
            })
        }
    };

    componentDidMount() {
        service.getBikeRentalStations(this.props.position, 100000).then(stations => {
            this.setState({
                stations,
            })
        })
    }

    getSuggestions = (value) => {
        const inputValue = value.trim().toLowerCase()
        const inputLength = inputValue.length

        return inputLength === 0 ? [] : this.state.stations.filter(station => station.name.toLowerCase().slice(0, inputLength) === inputValue)
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
            placeholder: 'Søk på bysykkelstativ for å legge til',
            value,
            onChange: this.onChange,
        }

        return (
            <div className="input-container-admin">
                <p className="searchPanel-label">Bysykkelstativ</p>
                <ReactAutosuggest
                    id="BikePanelSearch"
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

export default BikePanelSearch
