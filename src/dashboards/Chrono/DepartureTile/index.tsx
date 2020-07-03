import React from 'react'
import { LegMode } from '@entur/sdk'
import { colors } from '@entur/tokens'

import {
    getIcon,
    unique,
    getTransportIconIdentifier,
    createTileSubLabel,
    isNotNullOrUndefined,
} from '../../../utils'
import { StopPlaceWithDepartures, LineData } from '../../../types'

import Tile from '../components/Tile'
import TileRow from '../components/TileRow'

import './styles.scss'

function getTransportHeaderIcons(
    departures: LineData[],
    hiddenModes?: LegMode[],
): JSX.Element[] {
    const transportModes = unique(
        departures
            .map(({ type, subType }) => ({ type, subType }))
            .filter(({ type }) => !hiddenModes || !hiddenModes.includes(type)),
        (a, b) =>
            getTransportIconIdentifier(a.type, a.subType) ===
            getTransportIconIdentifier(b.type, b.subType),
    )

    const transportIcons = transportModes.map(({ type, subType }) => ({
        icon: getIcon(type, subType, colors.blues.blue60),
    }))

    return transportIcons.map(({ icon }) => icon).filter(isNotNullOrUndefined)
}

const DepartureTile = ({ stopPlaceWithDepartures }: Props): JSX.Element => {
    const { departures, name } = stopPlaceWithDepartures
    const headerIcons = getTransportHeaderIcons(departures)

    return (
        <Tile title={name} icons={headerIcons}>
            {departures.map(data => {
                const icon = getIcon(data.type, data.subType)
                const subLabel = createTileSubLabel(data)

                return (
                    <TileRow
                        key={data.id}
                        label={data.route}
                        subLabel={subLabel}
                        icon={icon}
                    />
                )
            })}
        </Tile>
    )
}

interface Props {
    stopPlaceWithDepartures: StopPlaceWithDepartures
}

export default DepartureTile
