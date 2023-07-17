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
    const deleteLines = () => {
        dispatch({ type: 'deleteLines', tileId: tile.uuid })
    }
    const setLines = (lines: string[]) => {
        dispatch({
            type: 'setLines',
            tileId: tile.uuid,
            lines,
        })
    }

    const uniqLines = uniqBy(lines, 'id').sort((a, b) => {
        if (!a || !a.publicCode || !b || !b.publicCode) return 1
        return a.publicCode.localeCompare(b.publicCode, 'no-NB', {
            numeric: true,
        })
    })

    return (
        <div>
            <Heading4>Velg linjer</Heading4>
            <Paragraph className={classes.paragraph}>
                Ved å huke av linjer vil visningen til avgangstavlen begrenses
                til de valgte linjene.
            </Paragraph>
            <Switch
                className={classes.selectAll}
                checked={tile.whitelistedLines?.length === uniqLines.length}
                onChange={() => {
                    if (tile.whitelistedLines?.length === uniqLines.length)
                        deleteLines()
                    else
                        setLines(
                            uniqLines.map((line) => {
                                return line.id
                            }),
                        )
                }}
            >
                Velg alle
            </Switch>
            <div className={classes.linesGrid}>
                {uniqLines.map((line) => (
                    <div key={line.id} className={classes.line}>
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
        </div>
    )
}

export { SelectLines }
