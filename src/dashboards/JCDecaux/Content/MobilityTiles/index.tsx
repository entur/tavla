import React from 'react'

import { FormFactor } from '@entur/sdk/lib/mobility/types'

import MobilityTile from './MobilityTile'

import './styles.scss'

const MobilityTiles = (): JSX.Element | null => (
    <div className="mobility-tiles-wrapper">
        <MobilityTile formFactor={FormFactor.CAR} />
        <MobilityTile formFactor={FormFactor.SCOOTER} />
    </div>
)

export default MobilityTiles
