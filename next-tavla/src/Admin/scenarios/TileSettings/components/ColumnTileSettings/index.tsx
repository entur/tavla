import React from 'react'
import classNames from 'classnames'
import classes from './styles.module.css'
import { Heading3 } from '@entur/typography'
import { ToggleColumns } from 'Admin/scenarios/ToggleColumns'
import { SelectLines } from 'Admin/scenarios/SelectLines'
import { TQuayTile, TStopPlaceTile } from 'types/tile'
import { TDepartureFragment, TLinesFragment } from 'graphql/index'
import { DeleteTile } from '../DeleteTile'
import { PlatformDropdown } from '../PlatformDropdown'
import { Preview } from 'Admin/scenarios/Preview'

function ColumnTileSettings({
    className,
    tile,
    lines,
    departures,
}: {
    className?: string
    tile: TStopPlaceTile | TQuayTile
    lines: TLinesFragment['lines']
    departures?: TDepartureFragment[]
}) {
    return (
        <div className={classNames(classes.tileSettingsWrapper, className)}>
            <div className={classes.tileSettingsHeader}>
                <DeleteTile uuid={tile.uuid} />
                <Heading3 className={classes.heading}>{tile.name}</Heading3>
            </div>

            <div className={classes.content}>
                <div className="flexBetween">
                    <PlatformDropdown tile={tile} />
                    <ToggleColumns tile={tile} />
                </div>
                <SelectLines tile={tile} lines={lines} />
                <Preview tile={tile} departures={departures} />
            </div>
        </div>
    )
}

export { ColumnTileSettings }
