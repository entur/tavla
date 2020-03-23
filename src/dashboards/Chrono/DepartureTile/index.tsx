import React from 'react'
import { LegMode } from '@entur/sdk'
import { colors } from '@entur/tokens'

import { getIcon, unique, getTransportIconIdentifier } from '../../../utils'
import { StopPlaceWithDepartures, LineData } from '../../../types'

import Tile from '../components/Tile'
import TileRow from '../components/TileRow'

import './styles.scss'

function getTransportHeaderIcons(
    departures: Array<LineData>,
    hiddenModes?: Array<LegMode>,
): Array<JSX.Element> {
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

    return transportIcons.map(({ icon }) => icon)
}

const DepartureTile = ({ stopPlaceWithDepartures }: Props): JSX.Element => {
    const { departures, name } = stopPlaceWithDepartures
    const headerIcons = getTransportHeaderIcons(departures)

    return (
        <Tile title={name} icons={headerIcons}>
            {departures.map(
                ({ id: departureId, route, type, subType, time }) => {
                    const icon = getIcon(type, subType)

                    return (
                        <TileRow
                            key={departureId}
                            label={route}
                            subLabel={time}
                            icon={icon}
                        />
                    )
                },
            )}
        </Tile>
    )
}

interface Props {
    stopPlaceWithDepartures: StopPlaceWithDepartures
}

export default DepartureTile
