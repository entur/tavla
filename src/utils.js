import React from 'react'
import {
    Bus, CityBike, Ferry, Lock, Metro, Train, Tram,
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
        case 'lock':
            return <Lock {...props} />
        default:
            return null
    }
}

export function groupBy(objectArray, property) {
    return objectArray.reduce((acc, obj) => {
        const key = obj[property]
        if (!acc[key]) {
            acc[key] = []
        }
        acc[key].push(obj)
        return acc
    }, {})
}
