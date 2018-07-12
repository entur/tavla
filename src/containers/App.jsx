import React from 'react'

const myStorage = window.localStorage

class App extends React.Component {
    constructor(props) {
        super(props)
        this.addLocation = this.addLocation.bind(this)
        this.handleLatlongSubmit = this.handleLatlongSubmit.bind(this)
    }

    componentDidMount() {
        const initData = myStorage.getItem('initialData')
        if (initData) {
            const { lat, long } = JSON.parse(initData)
            if (lat && long) {
                this.props.history.push('/dashboard')
            }
        }
    }

    addLocation() {
        navigator.geolocation.getCurrentPosition(position => {
            const latlong = { lat: position.coords.latitude, long: position.coords.longitude }
            this.goToDepartureBoard(latlong)
        })
    }

    handleLatlongSubmit(event) {
        event.preventDefault()
        const latlong = { lat: event.target.lat.value, long: event.target.long.value }
        this.goToDepartureBoard(latlong)
    }

    goToDepartureBoard(latlong) {
        myStorage.setItem('initialData', JSON.stringify(latlong))
        this.props.history.push('/dashboard')
    }


    render() {
        return (
            <div>
                <h1>Velkommen til tavla.en-tur.no</h1>
                <p>For at vi skal lage en tavle til deg trenger vi at du godtar at vi kan bruke din posisjon...</p>
                <button onClick={this.addLocation}>Godta bruk av posisjon</button>
                <p>...eller fyller inn relevante koordinater</p>
                <form onSubmit={this.handleLatlongSubmit}>
                    <label>Breddegrad </label>
                    <input type="text" name="lat" />
                    <label>Lengdegrad </label>
                    <input type="text" name="long" />
                    <input type="submit" value="Lag tavle" />
                </form>
            </div>
        )
    }
}


export default App
