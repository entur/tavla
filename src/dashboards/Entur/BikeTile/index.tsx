import React from 'react'
import { BikeRentalStation } from '@entur/sdk'

import { getIcon } from '../../../utils'

import Tile from '../components/Tile'
import TileRow from '../components/TileRow'

const BikeIcon = getIcon('bicycle')

const BikeTile = ({ stations }: Props): JSX.Element => {
    return (
        <Tile title="Bysykkel" icons={[<BikeIcon height={ 24 } width={ 24 } color="#D1D4E3" />]}>
            {
                stations.map(({
                    name, bikesAvailable, id, spacesAvailable,
                }) => (
                    <TileRow
                        key={id}
                        icon={<BikeIcon height={ 24 } width={ 24 } color="#D1D4E3" />}
                        label={name}
                        subLabels={[
                            bikesAvailable === 1 ? 'sykkel' : 'sykler',
                            spacesAvailable === 1 ? 'lås' : 'låser',
                        ]}
                    />
                ))
            }
        </Tile>
    )
}

interface Props {
    stations: Array<BikeRentalStation>,
}

export default BikeTile
