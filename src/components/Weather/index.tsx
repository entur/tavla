import React, { useEffect, useState } from 'react'

import { Tooltip } from '@entur/tooltip'

import {
    getWeatherDescriptionFromApi,
    ConditionalWrapper,
    getWeatherIconEntur,
} from '../../utils'

import './styles.scss'
interface Props {
    iconName: string
    type?: string
}

export const WeatherIcon = ({ iconName, type }: Props): JSX.Element => {
    const [description, setDescription] = useState('')
    const [weatherIcon, setWeatherIcon] = useState(<></>)

    useEffect(() => {
        const abortController = new AbortController()

        if (type === 'met')
            setWeatherIcon(
                <div className="icon">
                    <img
                        src={require('../../assets/weather/' +
                            iconName +
                            '.svg')}
                        alt={description}
                    />
                </div>,
            )
        else
            setWeatherIcon(
                <div className="icon-entur">
                    {getWeatherIconEntur(iconName)}
                </div>,
            )
        return () => {
            abortController.abort()
        }
    }, [iconName, type])

    return <>{weatherIcon}</>
}
