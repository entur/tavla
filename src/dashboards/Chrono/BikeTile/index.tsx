import React from 'react'
import { BikeRentalStation } from '@entur/sdk'
import { Heading3 } from '@entur/typography'
import { colors } from '@entur/tokens'

import { getIcon } from '../../../utils'

import Tile from '../components/Tile'

import './styles.scss'

const BikeIcon = getIcon('bicycle')

const BikeTile = ({ stations }: Props): JSX.Element => {
    return (
        <Tile
            title="Bysykkel"
            icons={[
                <BikeIcon
                    key="bike-tile-icon"
                    height={32}
                    width={32}
                    color={colors.blues.blue60}
                />,
            ]}
        >
            {stations.map(({ name, bikesAvailable, id, spacesAvailable }) => (
                <div key={id} className="bikerow">
                    <div className="bikerow__icon">
                        <BikeIcon
                            height={32}
                            width={32}
                            color={colors.transport.contrast.mobility}
                        />
                    </div>
                    <div className="bikerow__texts">
                        <Heading3 className="bikerow__label">{name}</Heading3>
                        <div className="bikerow__sublabels">
                            {bikesAvailable === 1 ? (
                                <span>1 sykkel</span>
                            ) : (
                                <span>{`${bikesAvailable} sykler`}</span>
                            )}
                            {spacesAvailable === 1 ? (
                                <span>1 lås</span>
                            ) : (
                                <span>{`${spacesAvailable} låser`}</span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </Tile>
    )
}

interface Props {
    stations: Array<BikeRentalStation>
}

export default BikeTile
