import React from 'react'
import { FormFactor } from '@entur/sdk/lib/mobility/types'
import { MobilityTile } from './MobilityTile/MobilityTile'
import './MobilityTiles.scss'

const MobilityTiles = ({ numberOfBikes }: Props): JSX.Element | null => (
    <div className="mobility-tiles-wrapper">
        <MobilityTile
            formFactor={FormFactor.CAR}
            numberOfBikes={numberOfBikes}
        />
    </div>
)

type Props = {
    numberOfBikes: number
}

export { MobilityTiles }
