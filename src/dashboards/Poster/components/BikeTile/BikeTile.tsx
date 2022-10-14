import React from 'react'
import { CityBikeIcon } from '@entur/icons'

const NumberSpan = ({ numberOfVehicles }: NumberSpanProps): JSX.Element => {
    if (numberOfVehicles > 99)
        return (
            <span className="available-vehicles-box-overflow">
                <span className="available-vehicles-box-overflow-number">
                    99
                </span>
                <span className="available-vehicles-box-overflow-symbol">
                    +
                </span>
            </span>
        )
    return <p>{numberOfVehicles}</p>
}

const BikeTile = ({ numberOfBikes }: BikeTileProps) => (
    <div className="bike-tile-wrapper">
        <div className="available-vehicles-box">
            <CityBikeIcon />
            <NumberSpan numberOfVehicles={numberOfBikes} />
        </div>
        <div className="vehicles-description">
            <h2 className="vehicles-description-heading">Sykler</h2>
            <h3 className="vehicles-description-area">
                Innen 100 meters radius
            </h3>
        </div>
    </div>
)

interface NumberSpanProps {
    numberOfVehicles: number
}

interface BikeTileProps {
    numberOfBikes: number
}

export { BikeTile }
