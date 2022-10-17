import React from 'react'
import { CloudRainIcon, UmbrellaIcon } from '@entur/icons'

interface PrecipitationProps {
    precipitationAmount?: number
    precipitationUnit?: string
    probability?: number
    probabilityUnit?: string
}

const Precipitation: React.FC<PrecipitationProps> = ({
    precipitationAmount,
    precipitationUnit,
    probability,
    probabilityUnit,
}) => {
    const showPrecipitation =
        precipitationAmount !== undefined && precipitationUnit !== undefined
    const showProbability =
        probability !== undefined && probabilityUnit !== undefined

    return (
        <>
            <div className="weather-tile__weather-data-container__weather-data">
                <CloudRainIcon size={20} />
                <div className="weather-tile__weather-data-container__weather-data__value">
                    {showPrecipitation
                        ? precipitationAmount + ' ' + precipitationUnit
                        : '…'}
                </div>
            </div>
            <div className="weather-tile__weather-data-container__weather-data">
                <UmbrellaIcon size={20} />
                <div className="weather-tile__weather-data-container__weather-data__value">
                    {showProbability
                        ? probability + ' ' + probabilityUnit
                        : '…'}
                </div>
            </div>
        </>
    )
}

export { Precipitation }
