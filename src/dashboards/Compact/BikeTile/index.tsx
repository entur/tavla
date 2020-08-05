import React, { useState, useEffect } from 'react'
import { BikeRentalStation } from '@entur/sdk'
import { colors } from '@entur/tokens'
import { BicycleIcon } from '@entur/icons'

import Tile from '../components/Tile'
import TileRow from '../components/TileRow'
import { useSettingsContext } from '../../../settings'
import { IconColorType } from '../../../types'
import { getIconColorType } from '../../../utils'

const BikeTile = ({ stations }: Props): JSX.Element => {
    const [settings] = useSettingsContext()
    const [iconColorType, setIconColorType] = useState<IconColorType>(
        IconColorType.CONTRAST,
    )

    useEffect(() => {
        if (settings) {
            setIconColorType(getIconColorType(settings.theme))
        }
    }, [settings])

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
                            color={colors.transport[iconColorType].mobility}
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
