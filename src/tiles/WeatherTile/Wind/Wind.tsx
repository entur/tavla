import React from 'react'
import { WindIcon } from '@entur/icons'
import { WeatherItem } from '../WeatherItem/WeatherItem'
import { WeatherItemValue } from '../WeatherItem/WeatherItemValue'

interface WindProps {
    windSpeed?: number
    unit?: string
}

const Wind: React.FC<WindProps> = ({ windSpeed, unit }) => {
    const showWind = windSpeed !== undefined && unit !== undefined
    return (
        <WeatherItem>
            <WindIcon size={20} />
            <WeatherItemValue>
                {showWind ? windSpeed + ' ' + unit : '…'}
            </WeatherItemValue>
        </WeatherItem>
    )
}

export { Wind }
