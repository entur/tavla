import React from 'react'
import { CarIcon } from '@entur/icons'
import { NumberDisplay } from '../NumberDisplay/NumberDisplay'

const CarTile = ({ numberOfCars }: CarTileProps) => (
    <>
        <CarIcon />
        <NumberDisplay numberOfVehicles={numberOfCars} />
    </>
)

interface CarTileProps {
    numberOfCars: number
}

export { CarTile }
