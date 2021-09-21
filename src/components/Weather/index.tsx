import React, { useEffect, useState } from 'react'

import { Tooltip } from '@entur/tooltip'

import {
    getWeatherDescriptionFromApi,
    ConditionalWrapper,
    getWeatherIconEnTur,
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
                <div className="icon_entur">
                    {getWeatherIconEnTur(iconName)}
                </div>,
            )

        getWeatherDescriptionFromApi(iconName, abortController.signal)
            .then((fetchedDescription) => setDescription(fetchedDescription))
            .catch((error) => {
                if (error.name === 'AbortError') return
                setDescription('')
                throw error
            })
        return () => {
            abortController.abort()
        }
    }, [iconName, type])

    return (
        <ConditionalWrapper
            condition={description !== ''}
            wrapper={(children: JSX.Element) => (
                <Tooltip content={description} placement="top">
                    {children}
                </Tooltip>
            )}
        >
            {weatherIcon}
        </ConditionalWrapper>
    )
}
