import React from 'react'
import { CloudRainIcon, UmbrellaIcon } from '@entur/icons'
import { WeatherItem } from '../WeatherItem/WeatherItem'
import { WeatherItemValue } from '../WeatherItem/WeatherItemValue'

function Precipitation({
    precipitationAmount,
    precipitationUnit,
    probability,
    probabilityUnit,
}: {
    precipitationAmount?: number
    precipitationUnit?: string
    probability?: number
    probabilityUnit?: string
}) {
    const showPrecipitation =
        precipitationAmount !== undefined && precipitationUnit !== undefined
    const showProbability =
        probability !== undefined && probabilityUnit !== undefined

    return (
        <>
            <WeatherItem>
                <CloudRainIcon size={20} />
                <WeatherItemValue>
                    {showPrecipitation
                        ? precipitationAmount + ' ' + precipitationUnit
                        : '…'}
                </WeatherItemValue>
            </WeatherItem>
            <WeatherItem>
                <UmbrellaIcon size={20} />
                <WeatherItemValue>
                    {showProbability
                        ? probability + ' ' + probabilityUnit
                        : '…'}
                </WeatherItemValue>
            </WeatherItem>
        </>
    )
}

export { Precipitation }
