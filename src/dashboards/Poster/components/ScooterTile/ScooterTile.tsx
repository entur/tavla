import React from 'react'
import { ScooterIcon } from '@entur/icons'
import { FormFactor } from '@entur/sdk/lib/mobility/types'
import { NumberDisplay } from '../NumberDisplay/NumberDisplay'
import { useMobility } from '../../../../logic/useMobility'

const ScooterTile = ({ numberOfScooters }: ScooterTileProps): JSX.Element => {
    const scooters = useMobility(FormFactor.SCOOTER)
    return (
        <>
            <ScooterIcon />
            <NumberDisplay numberOfVehicles={scooters?.length || 0} />
        </>
    )
}

interface ScooterTileProps {
    numberOfScooters: number
}

export { ScooterTile }
