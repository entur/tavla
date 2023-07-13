import { Switch } from '@entur/form'
import { TQuayTile, TStopPlaceTile } from 'types/tile'
import { uniqBy } from 'lodash'
import classes from './styles.module.css'
import { useSettingsDispatch } from 'Admin/utils/contexts'
import { Heading4, Paragraph } from '@entur/typography'

function SelectLines<T extends TStopPlaceTile | TQuayTile>({
    tile,
    lines,
}: {
    tile: T
    lines: { id: string; publicCode: string | null; name: string | null }[]
}) {
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
        <div className={classes.linesGrid}>
            <Heading4>Velg linjer</Heading4>
            <Paragraph className={classes.paragraph}>
                Huk av de linjene du vil vise.
            </Paragraph>
            {uniqLines.map((line) => (
                <div key={line.id}>
                    <Switch
                        checked={
                            tile.whitelistedLines?.includes(line.id) ?? false
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
    )
}

export { SelectLines }
