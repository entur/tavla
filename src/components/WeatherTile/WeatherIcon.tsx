import React from 'react'
import { getWeatherIconEntur } from '../../utils'

interface WeatherIconProps {
    symbolCode?: string
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ symbolCode }) => (
    <div>
        {symbolCode ? (
            <div className="icon-entur">{getWeatherIconEntur(symbolCode)}</div>
        ) : (
            '…'
        )}
    </div>
)

export { WeatherIcon }
