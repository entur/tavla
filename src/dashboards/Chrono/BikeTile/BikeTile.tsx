import React, { useState, useEffect, useMemo } from 'react'
import { colors } from '@entur/tokens'
import { BicycleIcon } from '@entur/icons'
import { Tile } from '../../../components/Tile/Tile'
import { useSettings } from '../../../settings/SettingsProvider'
import { IconColorType } from '../../../types'
import { getTranslation } from '../../../utils/utils'
import { getIconColorType } from '../../../utils/icon'
import { useWalkInfo, WalkInfo } from '../../../logic/use-walk-info/useWalkInfo'
import { UseRentalStations_StationFragment } from '../../../../graphql-generated/mobility-v2'
import { TileRow } from '../components/TileRow/TileRow'
import './BikeTile.scss'

function getWalkInfo(walkInfos: WalkInfo[], id: string): WalkInfo | undefined {
    return walkInfos.find((walkInfo) => walkInfo.stopId === id)
}

const BikeTile = ({ stations }: Props): JSX.Element => {
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
        <Tile
            variant="chrono"
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
    stations: UseRentalStations_StationFragment[]
}

export { BikeTile }
