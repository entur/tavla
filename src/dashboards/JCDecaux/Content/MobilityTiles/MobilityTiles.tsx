import React from 'react'
import { FormFactor } from '@entur/sdk/lib/mobility/types'
import { MobilityTile } from './MobilityTile/MobilityTile'
import './MobilityTiles.scss'

// note: naming av mobilitytiles mobilitytile er noe vanskelig
// reuse feels meh her

const MobilityTiles = ({ numberOfBikes }: Props): JSX.Element | null => (
    <div className="mobility-tiles-wrapper">
        <MobilityTile
            formFactor={FormFactor.CAR}
            numberOfBikes={numberOfBikes}
        />
        {/* <MobilityTile
            formFactor={FormFactor.SCOOTER}
            numberOfBikes={numberOfBikes}
        />
        <MobilityTile
            formFactor={FormFactor.BICYCLE}
            numberOfBikes={numberOfBikes}
        /> */}
    </div>
)

type Props = {
    numberOfBikes: number
}

export { MobilityTiles }
