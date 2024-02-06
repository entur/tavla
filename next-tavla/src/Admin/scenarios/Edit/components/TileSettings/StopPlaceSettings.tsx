import { StopPlaceEditQuery } from 'graphql/index'
import { useQuery } from 'graphql/utils'
import { fieldsNotNull } from 'utils/typeguards'
import { TStopPlaceTile } from 'types/tile'
import React from 'react'
import classes from './styles.module.css'
import { Heading3 } from '@entur/typography'
import { DeleteTile } from '../DeleteTile'
import { ToggleColumns } from '../ToggleColumns'
import { SelectLines } from '../SelectLines'

function StopPlaceSettings({ tile }: { tile: TStopPlaceTile }) {
    const lines =
        useQuery(StopPlaceEditQuery, {
            placeId: tile.placeId,
        })
            .data?.stopPlace?.quays?.flatMap((q) => q?.lines)
            .filter(fieldsNotNull) || []

    return (
        <div className={classes.tileSettingsWrapper}>
            <div className="flexRow alignCenter g-3">
                <DeleteTile uuid={tile.uuid} />
                <Heading3 className="m-0">{tile.name}</Heading3>
            </div>
            <ToggleColumns tile={tile} />
            <SelectLines tile={tile} lines={lines} />
        </div>
    )
}

export { StopPlaceSettings }
