import { Checkbox } from '@entur/form'
import { TravelSwitch } from '@entur/travel'
import { TQuayTile, TStopPlaceTile } from 'types/tile'
import { uniqBy, xor } from 'lodash'
import classes from './styles.module.css'
import { useSettingsDispatch } from 'Admin/utils/contexts'
import { Heading4, SubParagraph } from '@entur/typography'
import { TLinesFragment } from 'graphql/index'
import { TTransportMode } from 'types/graphql-schema'
import { useCallback } from 'react'
import { Transport } from '@entur/travel/dist/utils'

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

function getTransportMode(transportMode: TTransportMode): Transport {
    switch (transportMode) {
        case 'coach':
        case 'trolleybus':
            return 'bus'
        case 'lift':
        case 'unknown':
            return 'none'
        case 'monorail':
            return 'rail'
        default:
            return transportMode
    }
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

    const removeLines = useCallback(
        (lines: string[]) => {
            dispatch({ type: 'removeLines', tileId: tile.uuid, lineIds: lines })
        },
        [dispatch, tile.uuid],
    )

    const getNotWhitelistedTransportModeLines = (
        transportModeWhiteList: TTransportMode[],
    ) =>
        uniqLines
            .filter(
                (line) =>
                    !transportModeWhiteList.includes(
                        line.transportMode ?? 'unknown',
                    ) ?? false,
            )
            .map((line) => line.id)

    const toggleTransportMode = (transportMode: TTransportMode) => {
        const modes = tile.whitelistedTransportModes ?? []
        const updatedModes = xor(modes, [transportMode])
        const linesToRemove = getNotWhitelistedTransportModeLines(updatedModes)
        removeLines(linesToRemove)

        dispatch({
            type: 'setTransportModes',
            tileId: tile.uuid,
            transportModes: updatedModes,
        })
    }

    const isLineDisabled = useCallback(
        (transportMode: TTransportMode) => {
            if (!tile.whitelistedTransportModes) return false
            return (
                tile.whitelistedTransportModes.length > 0 &&
                !tile.whitelistedTransportModes.includes(transportMode)
            )
        },
        [tile.whitelistedTransportModes],
    )

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

    const selectAllLines = useCallback(
        (transportMode: TTransportMode) => {
            const allLinesForMode = uniqLines
                .filter((line) => line.transportMode === transportMode)
                .map((line) => line.id)

            dispatch({
                type: 'setLines',
                tileId: tile.uuid,
                lines: [...(tile.whitelistedLines || []), ...allLinesForMode],
            })
        },
        [dispatch, tile.uuid, uniqLines, tile.whitelistedLines],
    )

    const isAllLinesSelected = useCallback(
        (transportMode: TTransportMode) => {
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
        },
        [tile.whitelistedLines, uniqLines],
    )

    const toggleSelectAllLines = useCallback(
        (transportMode: TTransportMode) => {
            if (isAllLinesSelected(transportMode)) {
                removeLines(
                    uniqLines
                        .filter((line) => line.transportMode === transportMode)
                        .map((line) => line.id),
                )
            } else {
                selectAllLines(transportMode)
            }
        },
        [selectAllLines, isAllLinesSelected, removeLines, uniqLines],
    )

    return (
        <div className={classes.lineSettingsWrapper}>
            <Heading4>Velg transportmidler</Heading4>
            <div className={classes.linesGrid}>
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
