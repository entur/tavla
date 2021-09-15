import React, { useState, useEffect } from 'react'
import { colors } from '@entur/tokens'
import { BicycleIcon } from '@entur/icons'
import { Station } from '@entur/sdk/lib/mobility/types'

import Tile from '../components/Tile'

import './styles.scss'
import { useSettingsContext } from '../../../settings'
import { IconColorType } from '../../../types'
import { getIconColorType } from '../../../utils'
import useWalkInfoBike, { WalkInfoBike } from '../../../logic/useWalkInfoBike'
import TileRow from '../components/TileRow'

function getWalkInfoBike(
    walkInfos: WalkInfoBike[],
    id: string,
): WalkInfoBike | undefined {
    return walkInfos.find((walkInfoBike) => walkInfoBike.stopId === id)
}

const BikeTile = ({ stations }: Props): JSX.Element => {
    const [settings] = useSettingsContext()
    const hideWalkInfo = settings?.hideWalkInfo
    const [iconColorType, setIconColorType] = useState<IconColorType>(
        IconColorType.CONTRAST,
    )

    useEffect(() => {
        if (settings) {
            setIconColorType(getIconColorType(settings.theme))
        }
    }, [settings])

    const walkInfoBike = useWalkInfoBike(stations)

    return (
        <Tile
            title="Bysykkel"
            icons={[
                <BicycleIcon
                    key="bike-tile-icon"
                    color={colors.transport[iconColorType].mobility}
                />,
            ]}
        >
            {stations.map((station) => (
                <TileRow
                    key={station.id}
                    icon={
                        <BicycleIcon
                            color={colors.transport[iconColorType].mobility}
                        />
                    }
                    walkInfoBike={
                        !hideWalkInfo
                            ? getWalkInfoBike(walkInfoBike || [], station.id)
                            : undefined
                    }
                    label={station.system.name.translation[0].value}
                    subLabels={[
                        {
                            time:
                                station.numBikesAvailable === 1
                                    ? '1 sykkel'
                                    : `${station.numBikesAvailable} sykler`,
                        },
                        {
                            time:
                                station.numDocksAvailable === 1
                                    ? '1 lås'
                                    : `${station.numBikesAvailable} låser`,
                        },
                    ]}
                />
            ))}
        </Tile>
    )
}

interface Props {
    stations: Station[]
}

export default BikeTile
