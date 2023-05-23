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
import { DraggableIcon } from '@entur/icons'
import { useHandle } from 'hooks/useHandle'
import { TStopPlaceTile } from 'types/tile'
import { TLine } from 'types/graphql/schema'
import { SortableColumns } from '../SortableColumns'

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

    const [handle, setHandle] = useHandle()

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
        <SortableTileWrapper id={tile.uuid} setHandle={setHandle}>
            <div className={classes.stopPlaceTile}>
                <div className={classes.tileHeader}>
                    {!data ? <Loader /> : data.stopPlace?.name ?? tile.placeId}
                    <div className="flexBetween">
                        <button className="button" onClick={removeSelf}>
                            <DeleteIcon size={16} />
                        </button>
                        {handle && (
                            <div
                                className="button"
                                {...handle.attributes}
                                {...handle.listeners}
                                aria-label="TODO: tile endre rekkefolge"
                            >
                                <DraggableIcon size={16} />
                            </div>
                        )}
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
