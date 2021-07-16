import React, { useState, useEffect } from 'react'
import { BikeRentalStation } from '@entur/sdk'
import { Heading3 } from '@entur/typography'
import { colors } from '@entur/tokens'
import { BicycleIcon } from '@entur/icons'

import Tile from '../components/Tile'

import './styles.scss'
import { useSettingsContext } from '../../../settings'
import { IconColorType } from '../../../types'
import { getIconColorType } from '../../../utils'
import useWalkInfoBike, { WalkInfoBike } from '../../../logic/useWalkInfoBike'
import TileRow from '../../Compact/components/TileRow'

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
            {/* {stations.map(({ name, bikesAvailable, id, spacesAvailable }) => (
                <div key={id} className="bikerow">
                    <div className="bikerow__icon">
                        <BicycleIcon
                            color={colors.transport[iconColorType].mobility}
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
            ))} */}
            {stations.map((station) => {
                return (
                    <TileRow
                        key={station.id}
                        icon={
                            <BicycleIcon
                                color={colors.transport[iconColorType].mobility}
                            />
                        }
                        walkInfoBike={
                            !hideWalkInfo
                                ? getWalkInfoBike(
                                      walkInfoBike || [],
                                      station.id,
                                  )
                                : undefined
                        }
                        label={station.name}
                        subLabels={[
                            {
                                time:
                                    station.bikesAvailable === 1
                                        ? '1 sykkel'
                                        : `${station.bikesAvailable} sykler`,
                            },
                            {
                                time:
                                    station.spacesAvailable === 1
                                        ? '1 lås'
                                        : `${station.spacesAvailable} låser`,
                            },
                        ]}
                    />
                )
            })}
        </Tile>
    )
}

interface Props {
    stations: BikeRentalStation[]
}

export default BikeTile
