import React from 'react'
import { CityBikeIcon } from '@entur/icons'
import { NumberDisplay } from '../NumberDisplay/NumberDisplay'

const BicycleTile = ({ numberOfBicycles }: BicycleProps) => (
    <>
        <CityBikeIcon />
        <NumberDisplay numberOfVehicles={numberOfBicycles} />
    </>
)

interface BicycleProps {
    numberOfBicycles: number
}

export { BicycleTile }
