import { Checkbox } from '@entur/form'
import { TravelSwitch } from '@entur/travel'
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
    const removeLines = (lines: string[]) => {
        dispatch({ type: 'removeLines', tileId: tile.uuid, lineIds: lines })
    }
    const toggleTransportMode = (transportMode: TTransportMode) => {
        dispatch({
            type: 'toggleTransportMode',
            tileId: tile.uuid,
            transportMode,
        })
    }

    const toggleSelectAllLines = (transportMode: TTransportMode) => {
        if (isAllLinesSelected(transportMode)) {
            removeLines(
                uniqLines
                    .filter((line) => line.transportMode === transportMode)
                    .map((line) => line.id),
            )
        } else {
            selectAllLines(transportMode)
        }
    }

    const selectAllLines = (transportMode: TTransportMode) => {
        const allLinesForMode = uniqLines
            .filter((line) => line.transportMode === transportMode)
            .map((line) => line.id)

        dispatch({
            type: 'setLines',
            tileId: tile.uuid,
            lines: [...(tile.whitelistedLines || []), ...allLinesForMode],
        })
    }

    const isAllLinesSelected = (transportMode: TTransportMode) => {
        const allLinesForMode = uniqLines
            .filter((line) => line.transportMode === transportMode)
            .map((line) => line.id)

        const selectedLinesForMode = (tile.whitelistedLines || []).filter(
            (line) => allLinesForMode.includes(line),
        )

        const allLinesIncluded = allLinesForMode.every((line) =>
            selectedLinesForMode.includes(line),
        )

        return allLinesIncluded && selectedLinesForMode.length > 0
    }

    const isLineDisabled = (transportMode: TTransportMode) => {
        if (!tile.whitelistedTransportModes) return false
        return (
            tile.whitelistedTransportModes.length > 0 &&
            !tile.whitelistedTransportModes.includes(transportMode)
        )
    }

    const getTransportMode = (transportMode: TTransportMode) => {
        switch (transportMode) {
            case 'coach':
                return 'bus'
            case 'trolleybus':
                return 'bus'
            case 'lift':
                return 'mobility'
            case 'monorail':
                return 'rail'
            case 'unknown':
                return 'mobility'
            default:
                return transportMode
        }
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

    const linesByMode = transportModes.map((transportMode) => ({
        transportMode: transportMode,
        lines: uniqLines.filter((line) => line.transportMode === transportMode),
    }))

    return (
        <div className={classes.lineSettingsWrapper}>
            <Heading4>Velg transportmidler</Heading4>
            <div className={classes.transportGrid}>
                {transportModes.map((transportMode) => {
                    const transportModeChecked =
                        tile.whitelistedTransportModes?.includes(
                            transportMode,
                        ) ?? false
                    return (
                        <div key={transportMode}>
                            <TravelSwitch
                                size="large"
                                transport={getTransportMode(transportMode)}
                                onChange={() => {
                                    toggleTransportMode(transportMode)
                                }}
                                checked={transportModeChecked}
                            >
                                {transportModeNames[transportMode]}
                            </TravelSwitch>
                        </div>
                    )
                })}
            </div>
            <Heading4>Velg linjer</Heading4>
            <SubParagraph>
                Ved å huke av boksene vil visningen til avgangstavlen begrenses
                til de valgene som har blitt gjort.
            </SubParagraph>
            <div className={classes.linesGrid}>
                {linesByMode.map(({ transportMode, lines }) => {
                    return (
                        <div key={transportMode}>
                            <Checkbox
                                className={classes.selectAll}
                                onChange={() => {
                                    toggleSelectAllLines(transportMode)
                                }}
                                checked={isAllLinesSelected(transportMode)}
                                disabled={isLineDisabled(transportMode)}
                            >
                                Velg alle
                            </Checkbox>
                            {lines.map((line) => {
                                const disabledLine =
                                    isLineDisabled(transportMode)
                                return (
                                    <Checkbox
                                        className={classes.line}
                                        key={`${line.publicCode}${line.name}`}
                                        checked={
                                            tile.whitelistedLines?.includes(
                                                line.id,
                                            ) ?? false
                                        }
                                        onChange={() => toggleLine(line.id)}
                                        disabled={disabledLine}
                                    >
                                        {line.publicCode} {line.name}
                                    </Checkbox>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export { SelectLines }
