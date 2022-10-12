import React, { useState, useEffect, useMemo } from 'react'
import { colors } from '@entur/tokens'
import { BicycleIcon } from '@entur/icons'
import { Station } from '@entur/sdk/lib/mobility/types'
import { Tile } from '../components/Tile/Tile'
import { useSettingsContext } from '../../../settings'
import { IconColorType } from '../../../types'
import { getIconColorType, getTranslation } from '../../../utils'
import { useWalkInfo, WalkInfo } from '../../../logic/useWalkInfo'
import { TileRow } from '../components/TileRow/TileRow'
import './BikeTile.scss'

function getWalkInfo(walkInfos: WalkInfo[], id: string): WalkInfo | undefined {
    return walkInfos.find((walkInfo) => walkInfo.stopId === id)
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

    const stationDestinations = useMemo(
        () =>
            stations.map((station) => ({
                id: station.id,
                coordinates: {
                    latitude: station.lat,
                    longitude: station.lon,
                },
            })),
        [stations],
    )

    const walkInfo = useWalkInfo(stationDestinations)

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
                    walkInfo={
                        !hideWalkInfo
                            ? getWalkInfo(walkInfo || [], station.id)
                            : undefined
                    }
                    label={getTranslation(station.name) || ''}
                    subLabels={[
                        {
                            time:
                                station.numBikesAvailable === 1
                                    ? '1 sykkel'
                                    : `${station.numBikesAvailable} sykler`,
                            departureTime: new Date(),
                        },
                        {
                            time:
                                station.numDocksAvailable === 1
                                    ? '1 lås'
                                    : `${station.numBikesAvailable} låser`,
                            departureTime: new Date(),
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

export { BikeTile }
