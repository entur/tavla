import { Checkbox } from '@entur/form'
import { TravelSwitch } from '@entur/travel'
import { TQuayTile, TStopPlaceTile } from 'types/tile'
import { uniqBy } from 'lodash'
import classes from './styles.module.css'
import { Heading4, SubParagraph } from '@entur/typography'
import { TLinesFragment } from 'graphql/index'
import { TTransportMode } from 'types/graphql-schema'
import { useCallback } from 'react'
import { useEditSettingsDispatch } from '../../utils/contexts'
import { getTransportMode, transportModeNames } from './utils'
import { useToggledTransportModes } from './hooks/useToggledTransportModes'

function SelectLines({
    tile,
    lines,
}: {
    tile: TStopPlaceTile | TQuayTile
    lines: TLinesFragment['lines']
}) {
    const dispatch = useEditSettingsDispatch()
    const [toggledTransportModes, toggleTransportMode] =
        useToggledTransportModes(tile, lines)

    const toggleLine = (line: string) => {
        dispatch({ type: 'toggleLine', tileId: tile.uuid, lineId: line })
    }

    const removeLines = useCallback(
        (lines: string[]) => {
            dispatch({ type: 'removeLines', tileId: tile.uuid, lineIds: lines })
        },
        [dispatch, tile.uuid],
    )

    const uniqLines = uniqBy(lines, 'id').sort((a, b) => {
        if (!a || !a.publicCode || !b || !b.publicCode) return 1
        return a.publicCode.localeCompare(b.publicCode, 'no-NB', {
            numeric: true,
        })
    })

    const linesByMode = toggledTransportModes
        .map((i) => i.transportMode)
        .map((transportMode) => ({
            transportMode: transportMode,
            lines: uniqLines.filter(
                (line) => line.transportMode === transportMode,
            ),
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
                {toggledTransportModes.map(({ transportMode, toggled }) => (
                    <div key={transportMode}>
                        <TravelSwitch
                            size="large"
                            transport={getTransportMode(transportMode)}
                            onChange={() => {
                                toggleTransportMode(transportMode)
                            }}
                            checked={toggled}
                        >
                            {transportModeNames[transportMode]}
                        </TravelSwitch>
                    </div>
                ))}
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
                            >
                                Velg alle
                            </Checkbox>
                            {lines.map((line) => {
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
