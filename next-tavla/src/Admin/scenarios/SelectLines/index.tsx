import { Switch } from '@entur/form'
import { TQuayTile, TStopPlaceTile } from 'types/tile'
import { uniqBy } from 'lodash'
import classes from './styles.module.css'
import { useSettingsDispatch } from 'Admin/utils/contexts'
import { Heading4, Heading5, SubParagraph } from '@entur/typography'
import { TLinesFragment } from 'graphql/index'
import { TTransportMode } from 'types/graphql-schema'

const transportModeNames: Record<TTransportMode, string> = {
    air: 'Fly',
    bus: 'Buss',
    cableway: 'Kabelbane',
    water: 'Båt',
    funicular: 'Taubane',
    lift: 'Heis',
    rail: 'Tog',
    metro: 'T-bane',
    tram: 'Trikk',
    trolleybus: 'Trolley-buss',
    monorail: 'Enskinnebane',
    coach: 'Buss',
    unknown: 'Ukjent',
}

function SelectLines<T extends TStopPlaceTile | TQuayTile>({
    tile,
    lines,
}: {
    tile: T
    lines: TLinesFragment['lines']
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

    const transportModes: TTransportMode[] = uniqBy(lines, 'transportMode').map(
        (line) => line.transportMode ?? 'unknown',
    )

    const uniqLines = uniqBy(lines, 'id').sort((a, b) => {
        if (!a || !a.publicCode || !b || !b.publicCode) return 1
        return a.publicCode.localeCompare(b.publicCode, 'no-NB', {
            numeric: true,
        })
    })

    return (
        <div className={classes.lineSettingsWrapper}>
            <Heading4>Velg linjer</Heading4>
            <SubParagraph>
                Ved å huke av linjer vil visningen til avgangstavlen begrenses
                til de valgte linjene.
            </SubParagraph>
            <Switch
                className={classes.selectAll}
                checked={tile.whitelistedLines?.length === uniqLines.length}
                onChange={() => {
                    if (tile.whitelistedLines?.length === uniqLines.length)
                        deleteLines()
                    else setLines(uniqLines.map((line) => line.id))
                }}
            >
                Velg alle
            </Switch>
            {transportModes.map((mode) => (
                <div key={mode}>
                    <Heading5>{transportModeNames[mode]}</Heading5>
                    <div className={classes.linesGrid}>
                        {uniqLines
                            .filter((line) => line.transportMode === mode)
                            .map((line) => (
                                <div key={line.id} className={classes.line}>
                                    <Switch
                                        checked={
                                            tile.whitelistedLines?.includes(
                                                line.id,
                                            ) ?? false
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
            ))}
        </div>
    )
}

export { SelectLines }
