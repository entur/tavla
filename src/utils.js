import React from 'react'
import { Bus, CityBike } from './components/icons'

export function getIcon(type, props) {
    switch (type) {
        case 'bus':
            return <Bus color="#5AC39A" {...props} />
        case 'bike':
            return <CityBike {...props} />
        default:
            return null
    }
}

export function getPositionFromUrl() {
    const positionArray = window.location.pathname.split('/')[2].split('@')[1].split('-').join('.').split(/,/)
    return { latitude: positionArray[0], longitude: positionArray[1] }
}

export function getSettingsFromUrl() {
    const settings = window.location.pathname.split('/')[3]
    return JSON.parse(atob(settings)) || { hiddenSet: [], distance: 500 }
}
