import React from 'react'
import {
    Bus, CityBike, Ferry, Metro, Train, Tram,
} from './components/icons'

export function getIcon(type, props) {
    switch (type) {
        case 'bus':
            return <Bus {...props} />
        case 'bike':
            return <CityBike {...props} />
        case 'ferry':
            return <Ferry {...props} />
        case 'metro':
            return <Metro {...props} />
        case 'train':
            return <Train {...props} />
        case 'tram':
            return <Tram {...props} />
        default:
            return null
    }
}
