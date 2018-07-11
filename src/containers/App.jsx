import React from 'react'
import Lottie from 'react-lottie'
import * as animationData from '../components/animations/cycle_animation.json'

const myStorage = window.localStorage

class App extends React.Component {
    addLocation() {
        navigator.geolocation.getCurrentPosition(data => {
            const position = { lat: data.coords.latitude, lon: data.coords.longitude }
            myStorage.setItem('initialData', JSON.stringify(position))
            const pos = (`${position.lat},${position.lon}`).split('.').join('-')
            this.props.history.push(`/dashboard/@${pos}`)
        })
    }

    componentDidMount() {
        const initData = myStorage.getItem('initialData')
        if (!initData) return this.addLocation()
        const { lat, lon } = JSON.parse(initData)
        if (!lat || !lon) return this.addLocation()
        const pos = (`${lat},${lon}`).split('.').join('-')
        this.props.history.push(`/dashboard/@${pos}`)
    }

    render() {
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
}


export default App
