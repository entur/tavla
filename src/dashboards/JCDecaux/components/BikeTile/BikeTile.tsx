import React from 'react'
import { CityBikeIcon } from '@entur/icons'

const NumberSpan = ({
    numberOfVehicles,
}: NumberSpanProps): JSX.Element | null => {
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
    <div className="mobility-tiles-wrapper">
        <div className="mobility-tile-wrapper">
            <div className="available-vehicles-box">
                <CityBikeIcon />
                <NumberSpan numberOfVehicles={numberOfBikes} />
            </div>
            <div className="vehicles-description">
                <h2 className="vehicles-description-heading">Elsparkesykler</h2>
                <h3 className="vehicles-description-area">
                    Innen 500 meters radius
                </h3>
            </div>
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
