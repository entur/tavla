import React from 'react'
import classNames from 'classnames'
import classes from './styles.module.css'
import { Heading3 } from '@entur/typography'
import { TQuayTile, TStopPlaceTile } from 'types/tile'
import { TDepartureFragment, TLinesFragment } from 'graphql/index'
import { DeleteTile } from '../DeleteTile'
import { Preview } from '../Preview'
import { PlatformDropdown } from '../PlatformDropdown'
import { ToggleColumns } from '../ToggleColumns'
import { SelectLines } from '../SelectLines'
import { RowsSelector } from '../RowsSelector'

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
                <div className={classes.title}>
                    <DeleteTile uuid={tile.uuid} />
                    <Heading3 className={classes.heading}>{tile.name}</Heading3>
                </div>
                <RowsSelector tile={tile} />
            </div>
            <Preview tile={tile} departures={departures} />
            <div className={classes.content}>
                <div className="flexBetween">
                    <PlatformDropdown tile={tile} />
                    <ToggleColumns tile={tile} />
                </div>
                <SelectLines tile={tile} lines={lines} />
            </div>
        </div>
    )
}

export { ColumnTileSettings }
