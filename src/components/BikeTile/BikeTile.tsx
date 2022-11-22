import React, { useState, useEffect, useMemo } from 'react'
import { colors } from '@entur/tokens'
import { BicycleIcon } from '@entur/icons'
import { Tile } from '../Tile/Tile'
import { TileHeader } from '../TileHeader/TileHeader'
import { useSettings } from '../../settings/SettingsProvider'
import { IconColorType } from '../../types'
import { getTranslation } from '../../utils/utils'
import { getIconColorType } from '../../utils/icon'
import { useWalkInfo, WalkInfo } from '../../logic/use-walk-info/useWalkInfo'
import { UseRentalStations_StationFragment } from '../../../graphql-generated/mobility-v2'
import { BikeTileRow } from './BikeTileRow'
import classes from './BikeTile.module.scss'

function getWalkInfo(walkInfos: WalkInfo[], id: string): WalkInfo | undefined {
    return walkInfos.find((walkInfo) => walkInfo.stopId === id)
}

interface BikeTileProps {
    stations: UseRentalStations_StationFragment[]
}

const BikeTile: React.FC<BikeTileProps> = ({ stations }) => {
    const [settings] = useSettings()
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
        <Tile className={classes.BikeTile}>
            <TileHeader
                title="Bysykkel"
                icons={[
                    <BicycleIcon
                        key="bike-tile-icon"
                        color={colors.transport[iconColorType].mobility}
                    />,
                ]}
            />
            {stations.map((station) => (
                <BikeTileRow
                    key={station.id}
                    icon={
                        <BicycleIcon
                            color={colors.transport[iconColorType].mobility}
                        />
                    }
                    walkInfo={
                        !settings.hideWalkInfo
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
                                    : `${station.numDocksAvailable} låser`,
                            departureTime: new Date(),
                        },
                    ]}
                />
            ))}
        </Tile>
    )
}

export { BikeTile }
