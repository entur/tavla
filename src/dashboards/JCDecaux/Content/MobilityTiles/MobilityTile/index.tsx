import React from 'react'

import { FormFactor } from '@entur/sdk/lib/mobility/types'

import AvailableVehicles from './AvailableVehicles'
import Description from './Description'
import './styles.scss'

const MobilityTile = ({ formFactor }: Props): JSX.Element | null => (
    <div className="mobility-tile-wrapper">
        <AvailableVehicles formFactor={formFactor} />
        <Description formFactor={formFactor} />
    </div>
)

interface Props {
    formFactor: FormFactor
}
export default MobilityTile
