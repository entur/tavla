import React from 'react'

import { FormFactor } from '@entur/sdk/lib/mobility/types'

import AvailableVehicles from './AvailableVehicles'
import Description from './Description'
import './styles.scss'

const MobilityTile = ({
    formFactor,
    numberOfBikes,
}: Props): JSX.Element | null => (
    <div className="mobility-tile-wrapper">
        <AvailableVehicles
            formFactor={formFactor}
            numberOfCars={1}
            numberOfScooters={12}
            numberOfBikes={numberOfBikes}
        />
        <Description formFactor={formFactor} />
    </div>
)

interface Props {
    formFactor: FormFactor
    numberOfBikes: number
}

export default MobilityTile
