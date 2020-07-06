import React from 'react'
import { BikeRentalStation } from '@entur/sdk'
import { colors } from '@entur/tokens'
import { BicycleIcon } from '@entur/icons'

import Tile from '../components/Tile'
import TileRow from '../components/TileRow'

const BikeTile = ({ stations }: Props): JSX.Element => {
    return (
        <Tile
            title="Bysykkel"
            icons={[
                <BicycleIcon key="bike-icon" color={colors.blues.blue60} />,
            ]}
        >
            {stations.map(({ name, bikesAvailable, id, spacesAvailable }) => (
                <TileRow
                    key={id}
                    icon={
                        <BicycleIcon
                            color={colors.transport.contrast.mobility}
                        />
                    }
                    label={name}
                    subLabels={[
                        {
                            time:
                                bikesAvailable === 1
                                    ? '1 sykkel'
                                    : `${bikesAvailable} sykler`,
                        },
                        {
                            time:
                                spacesAvailable === 1
                                    ? '1 lås'
                                    : `${spacesAvailable} låser`,
                        },
                    ]}
                />
            ))}
        </Tile>
    )
}

interface Props {
    stations: BikeRentalStation[]
}

export default BikeTile
