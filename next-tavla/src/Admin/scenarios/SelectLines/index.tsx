import { Checkbox } from '@entur/form'
import { TQuayTile, TStopPlaceTile } from 'types/tile'
import { uniqBy } from 'lodash'
import classes from './styles.module.css'
import { useSettingsDispatch } from 'Admin/utils/contexts'
import { Heading4, SubParagraph } from '@entur/typography'
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
    coach: 'Langdistanse buss',
    unknown: 'Ukjent',
}

function SelectLines({
    tile,
    lines,
}: {
    tile: TStopPlaceTile | TQuayTile
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

    const linesByType = transportModes.map((transportMode) => ({
        transportType: transportMode,
        lines: uniqLines.filter((line) => line.transportMode === transportMode),
    }))

    return (
        <div className={classes.lineSettingsWrapper}>
            <Heading4>Velg linjer</Heading4>
            <SubParagraph>
                Ved å huke av linjer vil visningen til avgangstavlen begrenses
                til de valgte linjene.
            </SubParagraph>
            <Checkbox
                className={classes.selectAll}
                checked={
                    tile.whitelistedLines?.length === uniqLines.length
                        ? true
                        : !tile.whitelistedLines ||
                          tile.whitelistedLines.length === 0
                        ? false
                        : 'indeterminate'
                }
                onChange={() => {
                    if (tile.whitelistedLines?.length === uniqLines.length)
                        deleteLines()
                    else setLines(uniqLines.map((line) => line.id))
                }}
            >
                Velg alle
            </Checkbox>

            <div className={classes.linesGrid}>
                {linesByType.map(({ transportType, lines }) => (
                    <div key={transportType}>
                        <Checkbox className={classes.selectAll}>
                            {transportModeNames[transportType]}
                        </Checkbox>
                        <div
                            style={{
                                marginLeft: '1em',
                            }}
                        >
                            {lines.map((line) => (
                                <Checkbox
                                    key={line.name}
                                    checked={
                                        tile.whitelistedLines?.includes(
                                            line.id,
                                        ) ?? false
                                    }
                                    onChange={() => toggleLine(line.id)}
                                >
                                    {line.publicCode} {line.name}
                                </Checkbox>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export { SelectLines }
