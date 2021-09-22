import React, { useState, useEffect } from 'react'
import { colors } from '@entur/tokens'
import { BicycleIcon } from '@entur/icons'
import { Station } from '@entur/sdk/lib/mobility/types'

import Tile from '../components/Tile'
import TileRow from '../components/TileRow'
import { useSettingsContext } from '../../../settings'
import { IconColorType } from '../../../types'
import { getIconColorType, getTranslation } from '../../../utils'
import useWalkInfoBike, { WalkInfoBike } from '../../../logic/useWalkInfoBike'

function getWalkInfoBike(
    walkInfos: WalkInfoBike[],
    id: string,
): WalkInfoBike | undefined {
    return walkInfos.find((walkInfoBike) => walkInfoBike.stopId === id)
}

const BikeTile = ({ stations }: Props): JSX.Element => {
    const [settings] = useSettingsContext()
    const walkInfoBike = useWalkInfoBike(stations)
    const hideWalkInfo = settings?.hideWalkInfo
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
                <BicycleIcon
                    key="bike-icon"
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
                    label={getTranslation(station.name) || ''}
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
                                    : `${station.numDocksAvailable} låser`,
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
