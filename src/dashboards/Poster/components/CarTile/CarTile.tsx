import React from 'react'
import { RentalCarIcon } from '../../../../assets/icons/RentalCarIcon'
import { NumberDisplay } from '../NumberDisplay/NumberDisplay'

const CarTile = ({ numberOfCars }: CarTileProps) => (
    <>
        <RentalCarIcon />
        <NumberDisplay numberOfVehicles={numberOfCars} />
    </>
)

interface CarTileProps {
    numberOfCars: number
}

export { CarTile }
