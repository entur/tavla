import React, { useEffect, useState } from 'react'
import { uniqBy, xor } from 'lodash'
import { fieldsNotNull } from 'utils/typeguards'
import { DeleteIcon } from '@entur/icons'
import { Loader } from '@entur/loader'
import { Switch } from '@entur/form'
import { ExpandablePanel } from '@entur/expand'
import { SortableTileWrapper } from '../SortableTileWrapper'
import classes from './styles.module.css'
import { TStopPlaceSettingsData } from 'types/graphql'
import { stopPlaceSettingsQuery } from 'graphql/queries/stopPlaceSettings'
import { TStopPlaceTile } from 'types/tile'
import { SortableColumns } from '../SortableColumns'
import { SortableHandle } from '../SortableHandle'

function StopPlaceSettings({
    tile,
    setTile,
    removeSelf,
}: {
    tile: TStopPlaceTile
    setTile: (newTile: TStopPlaceTile) => void
    removeSelf: () => void
}) {
    const [data, setData] = useState<TStopPlaceSettingsData | undefined>(
        undefined,
    )

    useEffect(() => {
        if (!tile.placeId) return
        stopPlaceSettingsQuery({ id: tile.placeId }).then(setData)
    }, [tile.placeId])

    const lines =
        data?.stopPlace?.quays
            ?.flatMap((q) => q?.lines)
            .filter(fieldsNotNull) || []

    const uniqLines = uniqBy(lines, 'id').sort((a, b) => {
        if (!a || !a.publicCode || !b || !b.publicCode) return 1
        return a.publicCode.localeCompare(b.publicCode, 'no-NB', {
            numeric: true,
        })
    })

    return (
        <SortableTileWrapper id={tile.uuid}>
            <div className={classes.stopPlaceTile}>
                <div className={classes.tileHeader}>
                    {!data ? <Loader /> : data.stopPlace?.name ?? tile.placeId}
                    <div className="flexBetween">
                        <button className="button" onClick={removeSelf}>
                            <DeleteIcon size={16} />
                        </button>
                        <SortableHandle id={tile.uuid} />
                    </div>
                </div>
                <SelectLines
                    tile={tile}
                    setTile={setTile}
                    uniqLines={uniqLines}
                />
                <SortableColumns tile={tile} setTile={setTile} />
            </div>
        </SortableTileWrapper>
    )
}

function SelectLines({
    tile,
    setTile,
    uniqLines,
}: {
    tile: TStopPlaceTile
    setTile: (newTile: TStopPlaceTile) => void
    uniqLines: any[]
}) {
    const toggleLine = (line: string) => {
        if (!tile.whitelistedLines)
            return setTile({ ...tile, whitelistedLines: [line] })

        return setTile({
            ...tile,
            whitelistedLines: xor(tile.whitelistedLines, [line]),
        })
    }

    return (
        <div className={classes.lineToggleContainer}>
            <ExpandablePanel title="Velg linjer">
                {uniqLines.map((line) => (
                    <div key={line.id}>
                        <Switch
                            checked={tile.whitelistedLines?.includes(line.id)}
                            onChange={() => {
                                toggleLine(line.id)
                            }}
                        >
                            {line.publicCode} {line.name}
                        </Switch>
                    </div>
                ))}
            </ExpandablePanel>
        </div>
    )
}

export { StopPlaceSettings }
