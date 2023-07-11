import { Switch } from '@entur/form'
import { ExpandablePanel } from '@entur/expand'
import { TQuayTile, TStopPlaceTile } from 'types/tile'
import { uniqBy } from 'lodash'
import classes from './styles.module.css'
import { useSettingsDispatch } from 'Admin/utils/contexts'
import { StopPlaceSettingsQuery } from 'graphql/index'
import { useQuery } from 'graphql/utils'
import { fieldsNotNull } from 'utils/typeguards'

function SelectLines<T extends TStopPlaceTile | TQuayTile>({
    tile,
}: {
    tile: T
}) {
    const { data } = useQuery(StopPlaceSettingsQuery, { id: tile.placeId })
    const lines =
        data?.stopPlace?.quays
            ?.flatMap((q) => q?.lines)
            .filter(fieldsNotNull) || []

    const dispatch = useSettingsDispatch()
    const toggleLine = (line: string) => {
        dispatch({ type: 'toggleLine', tileId: tile.uuid, lineId: line })
    }

    const uniqLines = uniqBy(lines, 'id').sort((a, b) => {
        if (!a || !a.publicCode || !b || !b.publicCode) return 1
        return a.publicCode.localeCompare(b.publicCode, 'no-NB', {
            numeric: true,
        })
    })

    return (
        <div className={classes.lineToggleContainer}>
            <ExpandablePanel title="Velg linjer">
                <div className={classes.linesGrid}>
                    {uniqLines.map((line) => (
                        <div key={line.id}>
                            <Switch
                                checked={
                                    tile.whitelistedLines?.includes(line.id) ??
                                    false
                                }
                                onChange={() => {
                                    toggleLine(line.id)
                                }}
                            >
                                {line.publicCode} {line.name}
                            </Switch>
                        </div>
                    ))}
                </div>
            </ExpandablePanel>
        </div>
    )
}

export { SelectLines }
