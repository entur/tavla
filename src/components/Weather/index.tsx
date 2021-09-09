import React, { useEffect, useState } from 'react'

import { Tooltip } from '@entur/tooltip'

import { getWeatherDescriptionFromApi } from '../../utils'

import './styles.scss'

interface Props {
    iconName: string
}

export const WeatherIconApi = ({ iconName }: Props): JSX.Element => {
    const [description, setDescription] = useState('')

    useEffect(() => {
        getWeatherDescriptionFromApi(iconName).then((fetchedDescription) =>
            setDescription(fetchedDescription),
        )
    }, [iconName])

    return (
        <Tooltip content={description} placement="top">
            <div className="icon">
                <img
                    src={
                        'https://api.met.no/images/weathericons/svg/' +
                        iconName +
                        '.svg'
                    }
                />
            </div>
        </Tooltip>
    )
}

export const SunIconAnimated = (): JSX.Element => (
    <div className="icon">
        <div className="sun">
            <div className="rays"></div>
        </div>
    </div>
)

export const RainIconAnimated = (): JSX.Element => (
    <div className="icon">
        <div className="cloud"></div>
        <div className="rain"></div>
    </div>
)

export const ThunderIconAnimated = (): JSX.Element => (
    <div className="icon thunder-storm">
        <div className="cloud"></div>
        <div className="lightning">
            <div className="bolt"></div>
            <div className="bolt"></div>
        </div>
    </div>
)

export const PartlyCloudyIconAnimated = (): JSX.Element => (
    <div className="icon">
        <div className="cloud cloud_sun"></div>
        <div className="sun">
            <div className="rays"></div>
        </div>
    </div>
)
