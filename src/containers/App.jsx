import React from 'react'
import Lottie from 'react-lottie'
import * as animationData from '../components/animations/cycle_animation.json'

const myStorage = window.localStorage

class App extends React.Component {
    constructor(props) {
        super(props)
        this.addLocation = this.addLocation.bind(this)
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
            myStorage.setItem('initialData', JSON.stringify(latlong))
            this.props.history.push('/dashboard')
        })
    }

    renderAnimation() {
        const defaultOptions = {
            loop: true,
            autoplay: true,
            animationData,
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice',
            },
        }

        return <Lottie
            options={defaultOptions}
            height={400}
            width={400}
            isStopped={false}
        />
    }

    render() {
        return (
            <div>
                <h1>Velkommen til tavla.en-tur.no</h1>
                <p>For at vi skal lage en tavle til deg trenger vi at du godtar at vi kan bruke din posisjon</p>
                <button onClick={this.addLocation}>Godta bruk av posisjon</button>
            </div>
        )
    }
}


export default App
