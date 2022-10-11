import React from 'react'
import { FormFactor } from '@entur/sdk/lib/mobility/types'
import { BicycleIcon, CarIcon, ScooterIcon } from '@entur/icons'
import './AvailableVehicles.scss'

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

const AvailableVehicles = ({
    formFactor,
    numberOfCars,
    numberOfScooters,
    numberOfBikes,
}: AvailableVehicleProps): JSX.Element | null => (
    <>
        {formFactor === FormFactor.CAR && (
            <div className="available-vehicles-box">
                <CarIcon />
                <NumberSpan numberOfVehicles={numberOfCars} />
            </div>
        )}
        {formFactor === FormFactor.SCOOTER && (
            <div className="available-vehicles-box">
                <ScooterIcon />
                <NumberSpan numberOfVehicles={numberOfScooters} />
            </div>
        )}
        {formFactor === FormFactor.BICYCLE && (
            <div className="available-vehicles-box">
                <BicycleIcon color="currentColor" />
                <NumberSpan numberOfVehicles={numberOfBikes} />
            </div>
        )}
    </>
)

interface NumberSpanProps {
    numberOfVehicles: number
}

interface AvailableVehicleProps {
    formFactor: FormFactor
    numberOfCars: number
    numberOfScooters: number
    numberOfBikes: number
}

export { AvailableVehicles }
