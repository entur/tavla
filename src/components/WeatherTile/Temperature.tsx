import React from 'react'
import classNames from 'classnames'

interface TemperatureProps {
    description: string
    temperature?: number
}

const Temperature: React.FC<TemperatureProps> = ({
    description,
    temperature,
}) => {
    const isNegative = (temperature || -1) < 0

    return (
        <div className="weather-tile__icon-and-temperature__temperature-and-description">
            <div
                className={classNames(
                    'weather-tile__icon-and-temperature__temperature-and-description__temperature ',
                    isNegative
                        ? 'weather-tile__weather-data-container__weather-data--color-blue'
                        : 'weather-tile__weather-data-container__weather-data--color-red',
                )}
            >
                {temperature !== undefined
                    ? Math.round(temperature) + '°'
                    : '…'}
            </div>
            <div className="weather-tile__icon-and-temperature__temperature-and-description__description">
                {description}
            </div>
        </div>
    )
}

export { Temperature }
