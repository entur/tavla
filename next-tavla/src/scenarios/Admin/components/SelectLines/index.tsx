import { Switch } from '@entur/form'
import { ExpandablePanel } from '@entur/expand'
import { xor } from 'lodash'
import { TQuayTile, TStopPlaceTile } from 'types/tile'
import classes from './styles.module.css'

function SelectLines<T extends TStopPlaceTile | TQuayTile>({
    tile,
    setTile,
    uniqLines,
}: {
    tile: T
    setTile: (newTile: T) => void
    uniqLines: { id: string; publicCode: string | null; name: string | null }[]
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
