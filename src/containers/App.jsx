import React from 'react'

const myStorage = window.localStorage

class App extends React.Component {
    componentDidMount() {
        const initData = myStorage.getItem('initialData')
        if (!initData) return null
        const { lat, lon } = JSON.parse(initData)
        if (lat || lon) {
            const pos = (`${lat},${lon}`).split('.').join('-')
            this.props.history.push(`/dashboard/@${pos}`)
        }
    }

    addLocation = () => {
        navigator.geolocation.getCurrentPosition(data => {
            const position = { lat: data.coords.latitude, lon: data.coords.longitude }
            myStorage.setItem('initialData', JSON.stringify(position))
            this.goToDepartureBoard(position)
        })
    }

    goToDepartureBoard(position) {
        const pos = (`${position.lat},${position.lon}`).split('.').join('-')
        this.props.history.push(`/dashboard/@${pos}`)
    }

    handleLatlongSubmit = (event) => {
        const latlong = { lat: event.target.lat.value, long: event.target.long.value }
        this.goToDepartureBoard(latlong)
        event.preventDefault()
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
