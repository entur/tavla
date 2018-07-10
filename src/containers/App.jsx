import React from 'react'
import Lottie from 'react-lottie'
import * as animationData from '../components/animations/cycle_animation.json'

const myStorage = window.localStorage

class App extends React.Component {
    addLocation() {
        navigator.geolocation.getCurrentPosition(position => {
            const latlong = { latlong: { lat: position.coords.latitude, long: position.coords.longitude }, accepted: true }
            myStorage.setItem('initialData', JSON.stringify(latlong))
            this.props.history.push('/dashboard')
        })
    }

    componentDidMount() {
        const initData = myStorage.getItem('initialData')
        if (!initData) return this.addLocation()
        const { lat, long } = JSON.parse(initData).latlong
        if (!lat || !long) return this.addLocation()
        this.props.history.push('/dashboard')
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
