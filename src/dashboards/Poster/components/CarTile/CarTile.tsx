import React from 'react'
import { CarIcon } from '@entur/icons'
import './CarTile.scss'

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

const CarTile = ({ numberOfCars }: CarTileProps) => (
    <div className="mobility-tiles-wrapper">
        <div className="car-tile-wrapper">
            <div className="available-vehicles-box">
                <CarIcon />
                <NumberSpan numberOfVehicles={numberOfCars} />
            </div>
            <div className="vehicles-description">
                <h2 className="vehicles-description-heading">Delebil</h2>
                <h3 className="vehicles-description-area">
                    Parkeringsplassen ved Vestveien
                </h3>
            </div>
        </div>
    </div>
)

interface NumberSpanProps {
    numberOfVehicles: number
}

interface CarTileProps {
    numberOfCars: number
}

export { CarTile }
