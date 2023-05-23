import { Switch } from '@entur/form'
import { ExpandablePanel } from '@entur/expand'
import { xor } from 'lodash'
import { TQuayTile, TStopPlaceTile } from 'types/tile'
import { uniqBy } from 'lodash'
import classes from './styles.module.css'

function SelectLines<T extends TStopPlaceTile | TQuayTile>({
    tile,
    setTile,
    lines,
}: {
    tile: T
    setTile: (newTile: T) => void
    lines: { id: string; publicCode: string | null; name: string | null }[]
}) {
    const toggleLine = (line: string) => {
        if (!tile.whitelistedLines)
            return setTile({ ...tile, whitelistedLines: [line] })

        return setTile({
            ...tile,
            whitelistedLines: xor(tile.whitelistedLines, [line]),
        })
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
            </ExpandablePanel>
        </div>
    )
}

export { SelectLines }
