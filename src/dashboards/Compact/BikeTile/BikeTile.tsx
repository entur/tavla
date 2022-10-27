import React, { useState, useEffect, useMemo } from 'react'
import { colors } from '@entur/tokens'
import { BicycleIcon } from '@entur/icons'
import { Station } from '@entur/sdk/lib/mobility/types'
import { Tile } from '../components/Tile/Tile'
import { TileRow } from '../components/TileRow/TileRow'
import { useSettings } from '../../../settings/SettingsProvider'
import { IconColorType } from '../../../types'
import { getTranslation } from '../../../utils/utils'
import { useWalkInfo, WalkInfo } from '../../../logic/use-walk-info/useWalkInfo'
import { getIconColorType } from '../../../utils/icon'

function getWalkInfoBike(
    walkInfos: WalkInfo[],
    id: string,
): WalkInfo | undefined {
    return walkInfos.find((walkInfo) => walkInfo.stopId === id)
}

const BikeTile = ({ stations }: Props): JSX.Element => {
    const [settings] = useSettings()

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
                    walkInfo={
                        !hideWalkInfo
                            ? getWalkInfoBike(walkInfo || [], station.id)
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
                                    : `${station.numDocksAvailable} låser`,
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
