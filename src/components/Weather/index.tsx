import React, { useEffect, useState } from 'react'

import { Tooltip } from '@entur/tooltip'

import { getWeatherDescriptionFromApi, ConditionalWrapper } from '../../utils'

import './styles.scss'

interface Props {
    iconName: string
}

export const WeatherIconApi = ({ iconName }: Props): JSX.Element => {
    const [description, setDescription] = useState('')

    useEffect(() => {
        const abortController = new AbortController()
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
    }, [iconName])

    return (
        <ConditionalWrapper
            condition={description !== ''}
            wrapper={(children: JSX.Element) => (
                <Tooltip content={description} placement="top">
                    {children}
                </Tooltip>
            )}
        >
            <div className="icon">
                <img
                    src={require('../../assets/weather/' + iconName + '.svg')}
                    alt={description}
                />
            </div>
        </ConditionalWrapper>
    )
}

// The following animated icons are per now not in use but left for later incase animated icons are wanted
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
