import React, { useCallback, useMemo } from 'react'
import { ExpandablePanel } from '@entur/expand'
import { ClosedLockIcon } from '@entur/icons'
import { FilterChip } from '@entur/chip'
import { Line } from '../../../../../../logic/use-unique-lines/line'
import { TransportModeIcon } from '../../../../../../components/TransportModeIcon/TransportModeIcon'
import { useSettings } from '../../../../../../settings/SettingsProvider'
import { transportModeName } from '../transportModeName'
import classes from './PermanentLinePanel.module.scss'

const byTransportModeNameAndPublicCode = (a: Line, b: Line) =>
    `${transportModeName(a.transportMode)}${a.publicCode}`.localeCompare(
        `${transportModeName(b.transportMode)}${b.publicCode}`,
    )

type PermanentLinesPanelProps = {
    realtimeLines: Line[]
}

function PermanentLinesPanel({ realtimeLines }: PermanentLinesPanelProps) {
    const [settings, setSettings] = useSettings()

    const filteredLines = useMemo(
        () =>
            realtimeLines.filter(
                (line) =>
                    !settings.hiddenRealtimeDataLineRefs.includes(line.id),
            ),
        [settings.hiddenRealtimeDataLineRefs, realtimeLines],
    )

    const sortedLines = useMemo(
        () => filteredLines.sort(byTransportModeNameAndPublicCode),
        [filteredLines],
    )

    const handleFilterChipOnChange = useCallback(
        (line: Line) => () =>
            settings.permanentlyVisibleRoutesInMap
                .map(({ lineRef }) => lineRef)
                .includes(line.id)
                ? setSettings({
                      permanentlyVisibleRoutesInMap:
                          settings.permanentlyVisibleRoutesInMap.filter(
                              (route) => route.lineRef !== line.id,
                          ),
                      hideRealtimeData: false,
                  })
                : setSettings({
                      permanentlyVisibleRoutesInMap: [
                          ...settings.permanentlyVisibleRoutesInMap,
                          {
                              lineRef: line.id,
                              pointsOnLink: line.pointsOnLink,
                              mode: line.transportMode,
                          },
                      ],
                      hideRealtimeData: false,
                  }),
        [settings.permanentlyVisibleRoutesInMap, setSettings],
    )

    return (
        <div className={classes.PermanentLinePanel}>
            <ExpandablePanel
                title={
                    <div className={classes.Title}>
                        <span className={classes.Icon}>
                            <ClosedLockIcon />
                        </span>
                        <span>Permanente rutelinjer</span>
                    </div>
                }
                defaultOpen={filteredLines.length > 0}
            >
                <div className={classes.Lines}>
                    {sortedLines.map((line) => (
                        <div key={line.id}>
                            <FilterChip
                                className={classes.FilterChip}
                                value={line.id}
                                checked={settings.permanentlyVisibleRoutesInMap
                                    .map(
                                        (drawableRoute) =>
                                            drawableRoute.lineRef,
                                    )
                                    .includes(line.id)}
                                onChange={handleFilterChipOnChange(line)}
                            >
                                {line.publicCode}
                                <TransportModeIcon
                                    // Icons from eds don't concatenate classes correctly. Adding a ' ' fixes this.
                                    className={' ' + classes.TransportIcon}
                                    transportMode={line.transportMode}
                                />
                            </FilterChip>
                        </div>
                    ))}
                </div>
            </ExpandablePanel>
        </div>
    )
}

export { PermanentLinesPanel }
