import React from 'react'
import {
    CloudIcon,
    CloudLightningIcon,
    CloudRainIcon,
    CloudSnowIcon,
    SunCloudIcon,
    SunCloudRainIcon,
    SunIcon,
} from '@entur/icons'
import { arrayContains } from '../../utils/array'

const getWeatherIconEntur = (APIconName: string): JSX.Element => {
    const stripedAPIIconName = APIconName.replace(
        /heavy|light|showers|_|day|night/g,
        '',
    )
    const weatherConditions = stripedAPIIconName.split('and')

    const cloud = ['cloudy', 'fog']
    const sunCloud = ['fair', 'partlycloudy']
    const rain = ['rain']
    const lightning = ['thunder']
    const snow = ['snow', 'sleet']
    const sunCloudRain = ['rainshowers']
    const sun = ['clearsky']

    if (arrayContains(weatherConditions, lightning))
        return <CloudLightningIcon />
    if (arrayContains(weatherConditions, sunCloudRain))
        return <SunCloudRainIcon />
    if (arrayContains(weatherConditions, snow)) return <CloudSnowIcon />
    if (arrayContains(weatherConditions, rain)) return <CloudRainIcon />
    if (arrayContains(weatherConditions, sunCloud)) return <SunCloudIcon />
    if (arrayContains(weatherConditions, cloud)) return <CloudIcon />
    if (arrayContains(weatherConditions, sun))
        return <SunIcon className="icon-entur--sun" />
    return <div>?</div>
}

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
