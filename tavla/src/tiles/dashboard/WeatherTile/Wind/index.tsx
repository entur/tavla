import React from 'react'
import { WindIcon } from '@entur/icons'
import { WeatherItem } from '../WeatherItem'
import { WeatherItemValue } from '../WeatherItemValue'

function Wind({ windSpeed, unit }: { windSpeed?: number; unit?: string }) {
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
