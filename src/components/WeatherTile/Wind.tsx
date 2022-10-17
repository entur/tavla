import React from 'react'
import { WindIcon } from '@entur/icons'

interface WindProps {
    windSpeed?: number
    unit?: string
}

const Wind: React.FC<WindProps> = ({ windSpeed, unit }) => {
    const showWind = windSpeed !== undefined && unit !== undefined
    return (
        <div className="weather-tile__weather-data-container__weather-data">
            <WindIcon size={20} />
            <div className="weather-tile__weather-data-container__weather-data__value">
                {showWind ? windSpeed + ' ' + unit : '…'}
            </div>
        </div>
    )
}

export { Wind }
