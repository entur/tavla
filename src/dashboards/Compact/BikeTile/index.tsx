import React from 'react'
import { BikeRentalStation } from '@entur/sdk'
import { colors } from '@entur/tokens'

import { getIcon } from '../../../utils'

import Tile from '../components/Tile'
import TileRow from '../components/TileRow'

const BikeIcon = getIcon('bicycle')

const BikeTile = ({ stations }: Props): JSX.Element => {
    return (
        <Tile title="Bysykkel" icons={[<BikeIcon height={ 32 } width={ 32 } color={colors.blues.blue60} />]}>
            {
                stations.map(({
                    name, bikesAvailable, id, spacesAvailable,
                }) => (
                    <TileRow
                        key={id}
                        icon={<BikeIcon height={ 32 } width={ 32 } color={colors.transport.contrast.mobility} />}
                        label={name}
                        subLabels={[
                            bikesAvailable === 1 ? '1 sykkel' : `${bikesAvailable} sykler`,
                            spacesAvailable === 1 ? '1 lås' : `${spacesAvailable} låser`,
                        ]}
                    />
                ))
            }
        </Tile>
    )
}

interface Props {
    stations: Array<BikeRentalStation>
}

export default BikeTile
