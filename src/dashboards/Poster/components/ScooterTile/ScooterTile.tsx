import React from 'react'
import { ScooterIcon } from '@entur/icons'
import { NumberDisplay } from '../NumberDisplay/NumberDisplay'

const ScooterTile = ({ numberOfScooters }: ScooterTileProps): JSX.Element => (
    <>
        <ScooterIcon />
        <NumberDisplay numberOfVehicles={numberOfScooters} />
    </>
)

interface ScooterTileProps {
    numberOfScooters: number
}

export { ScooterTile }
