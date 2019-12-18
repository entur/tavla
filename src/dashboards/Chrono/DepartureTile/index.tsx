import React from 'react'
import { LegMode } from '@entur/sdk'
import { colors } from '@entur/tokens'

import { getIcon, getIconColor, unique } from '../../../utils'
import { StopPlaceWithDepartures, LineData } from '../../../types'

import Tile from '../components/Tile'
import TileRow from '../components/TileRow'

import './styles.scss'

function getTransportHeaderIcons(departures: Array<LineData>, hiddenModes?: Array<LegMode>): Array<JSX.Element> {
    const transportModes = unique(departures
        .map(({ type, subType }) => ({ type, subType }))
        .filter(({ type }) => !hiddenModes || !hiddenModes.includes(type)),
    ((a, b) => a.type === b.type && a.subType === b.subType))

    const transportIcons = transportModes
        .map(({ type, subType }) => ({ key: type + subType, Icon: getIcon(type, subType) }))
        .filter(({ Icon }, index, icons) => {
            // @ts-ignore
            const iconIndex = icons.findIndex(icon => icon.Icon.name === Icon.name)
            return iconIndex === index
        })

    return transportIcons.map(({ key, Icon }) => (
        <Icon key={ key } height={ 32 } width={ 32 } color={ colors.blues.blue60 } />
    ))
}

const DepartureTile = ({ stopPlaceWithDepartures }: Props): JSX.Element => {
    const { departures, name } = stopPlaceWithDepartures
    const headerIcons = getTransportHeaderIcons(departures)

    return (
        <Tile title={name} icons={headerIcons}>
            {
                departures.map(({
                    id: departureId, route, type, subType, time,
                }) => {
                    const Icon = getIcon(type, subType)
                    const iconColor = getIconColor(type, subType)

                    return (
                        <TileRow
                            key={departureId}
                            label={route}
                            subLabel={time}
                            icon={Icon ? <Icon height={ 32 } width={ 32 } color={ iconColor } className="route-icon" /> : null}
                        />
                    )
                })
            }
        </Tile>
    )
}

interface Props {
    stopPlaceWithDepartures: StopPlaceWithDepartures,
}

export default DepartureTile
