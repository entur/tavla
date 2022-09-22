import React from 'react'

import { FormFactor } from '@entur/sdk/lib/mobility/types'

import { BicycleIcon, CarIcon, ScooterIcon } from '@entur/icons'

import './styles.scss'

const AvailableVehicles = ({ formFactor }: Props): JSX.Element | null => (
    <>
        {formFactor === FormFactor.CAR && (
            <div className="available-vehicles-box">
                <CarIcon />
                <p>1</p>
            </div>
        )}
        {formFactor === FormFactor.SCOOTER && (
            <div className="available-vehicles-box">
                <ScooterIcon />
                <p>12</p>
            </div>
        )}
        {formFactor === FormFactor.BICYCLE && (
            <div className="available-vehicles-box">
                <BicycleIcon /> <p>3</p>
            </div>
        )}
    </>
)

interface Props {
    formFactor: FormFactor
}

export default AvailableVehicles
