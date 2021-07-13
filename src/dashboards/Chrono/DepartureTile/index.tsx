import React, { useState, useEffect } from 'react'
import { colors } from '@entur/tokens'

import {
    getIcon,
    unique,
    getTransportIconIdentifier,
    createTileSubLabel,
    isNotNullOrUndefined,
    getIconColorType,
} from '../../../utils'
import {
    StopPlaceWithDepartures,
    LineData,
    IconColorType,
} from '../../../types'

import Tile from '../components/Tile'
import TileRow from '../components/TileRow'

import './styles.scss'
import { useSettingsContext } from '../../../settings'
import { WalkInfo } from '../../../logic/useWalkInfo'

function getTransportHeaderIcons(departures: LineData[]): JSX.Element[] {
    const transportModes = unique(
        departures.map(({ type, subType }) => ({ type, subType })),
        (a, b) =>
            getTransportIconIdentifier(a.type, a.subType) ===
            getTransportIconIdentifier(b.type, b.subType),
    )

    const transportIcons = transportModes.map(({ type, subType }) => ({
        icon: getIcon(type, undefined, subType, colors.blues.blue60),
    }))

    return transportIcons.map(({ icon }) => icon).filter(isNotNullOrUndefined)
}

const DepartureTile = ({
    stopPlaceWithDepartures,
    walkInfo,
    isMobile = false,
    numberOfTileRows = 7,
}: Props): JSX.Element => {
    const { departures, name } = stopPlaceWithDepartures
    const headerIcons = getTransportHeaderIcons(departures)
    const [settings] = useSettingsContext()
    const hideSituations = settings?.hideSituations
    const [iconColorType, setIconColorType] = useState<IconColorType>(
        IconColorType.CONTRAST,
    )

    const limitedDepartures = departures.slice(0, numberOfTileRows)
    const visibleDepartures = isMobile ? limitedDepartures : departures

    useEffect(() => {
        if (settings) {
            setIconColorType(getIconColorType(settings.theme))
        }
    }, [settings])

    return (
        <Tile title={name} icons={headerIcons} walkInfo={walkInfo}>
            {visibleDepartures.map((data) => {
                const icon = getIcon(data.type, iconColorType, data.subType)
                const subLabel = createTileSubLabel(data)
                return (
                    <TileRow
                        key={data.id + Math.random()}
                        label={data.route}
                        subLabel={subLabel}
                        icon={icon}
                        hideSituations={hideSituations}
                    />
                )
            })}
        </Tile>
    )
}

interface Props {
    stopPlaceWithDepartures: StopPlaceWithDepartures
    walkInfo?: WalkInfo
    isMobile?: boolean
    numberOfTileRows?: number
}

export default DepartureTile
