import React, { useState, useEffect } from 'react'
import { BikeRentalStation } from '@entur/sdk'
import { colors } from '@entur/tokens'
import { BicycleIcon } from '@entur/icons'

import Tile from '../components/Tile'
import TileRow from '../components/TileRow'
import { useSettingsContext } from '../../../settings'

const BikeTile = ({ stations }: Props): JSX.Element => {
    const [settings] = useSettingsContext()
    const [contrast, setContrast] = useState<'default' | 'contrast'>('contrast')

    useEffect(() => {
        if (settings) {
            if (settings.theme === 'dark' || settings.theme === 'default') {
                setContrast('contrast')
            } else {
                setContrast('default')
            }
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
                            color={colors.transport[contrast].mobility}
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
