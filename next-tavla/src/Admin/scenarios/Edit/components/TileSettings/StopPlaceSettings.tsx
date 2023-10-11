import { StopPlaceQuery, StopPlaceSettingsQuery } from 'graphql/index'
import { useQuery } from 'graphql/utils'
import { fieldsNotNull } from 'utils/typeguards'
import { TStopPlaceTile } from 'types/tile'
import React from 'react'
import classes from './styles.module.css'
import { Heading3 } from '@entur/typography'
import { DeleteTile } from '../DeleteTile'
import { Preview } from '../Preview'
import { ToggleColumns } from '../ToggleColumns'
import { SelectLines } from '../SelectLines'

function StopPlaceSettings({ tile }: { tile: TStopPlaceTile }) {
    const lines =
        useQuery(StopPlaceSettingsQuery, {
            id: tile.placeId,
        })
            .data?.stopPlace?.quays?.flatMap((q) => q?.lines)
            .filter(fieldsNotNull) || []

    const departures = useQuery(StopPlaceQuery, {
        stopPlaceId: tile.placeId,
        whitelistedLines: tile.whitelistedLines,
        whitelistedTransportModes: tile.whitelistedTransportModes,
        numberOfDepartures: 5,
    }).data?.stopPlace?.estimatedCalls

    return (
        <div className={classes.tileSettingsWrapper}>
            <div className="flexRow alignCenter g-3">
                <DeleteTile uuid={tile.uuid} />
                <Heading3 className="m-0">{tile.name}</Heading3>
            </div>
            <Preview tile={tile} departures={departures} />
            <ToggleColumns tile={tile} />
            <SelectLines tile={tile} lines={lines} />
        </div>
    )
}

export { StopPlaceSettings }
