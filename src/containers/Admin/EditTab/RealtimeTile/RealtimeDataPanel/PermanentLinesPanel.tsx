import React from 'react'
import { ExpandablePanel } from '@entur/expand'
import { ClosedLockIcon } from '@entur/icons'
import { FilterChip } from '@entur/chip'
import { DrawableRoute } from '../../../../../types'
import { filterMap } from '../../../../../utils/array'
import { Settings } from '../../../../../settings/settings'
import { Line } from '../../../../../logic/use-unique-lines/line'
import { TransportModeIcon } from '../../../../../components/TransportModeIcon/TransportModeIcon'
import { transportModeName } from './transportModeName'
import './linesPanel.scss'

type PermanentLinesPanelProps = {
    realtimeLines: Line[]
    hiddenRealtimeDataLineRefs: string[]
    permanentlyVisibleRoutesInMap: DrawableRoute[]
    setSettings: (settings: Partial<Settings>) => void
}

function PermanentLinesPanel({
    realtimeLines,
    hiddenRealtimeDataLineRefs,
    permanentlyVisibleRoutesInMap,
    setSettings,
}: PermanentLinesPanelProps) {
    const filteredLines = filterMap(realtimeLines, (line) =>
        !hiddenRealtimeDataLineRefs.includes(line.id) && line.pointsOnLink
            ? { ...line, pointsOnLink: line.pointsOnLink }
            : undefined,
    )

    const sortedLines = filteredLines.sort((a, b) =>
        transportModeName(a.transportMode) + a.publicCode >
        transportModeName(b.transportMode) + b.publicCode
            ? 1
            : -1,
    )

    const handleFilterChipOnChange = (
        id: string,
        pointsOnLink: string,
        transportMode: string,
    ): void =>
        permanentlyVisibleRoutesInMap.map(({ lineRef }) => lineRef).includes(id)
            ? setSettings({
                  permanentlyVisibleRoutesInMap:
                      permanentlyVisibleRoutesInMap.filter(
                          (route) => route.lineRef !== id,
                      ),
                  hideRealtimeData: false,
              })
            : setSettings({
                  permanentlyVisibleRoutesInMap: [
                      ...permanentlyVisibleRoutesInMap,
                      {
                          lineRef: id,
                          pointsOnLink,
                          mode: transportMode,
                      },
                  ],
                  hideRealtimeData: false,
              })

    return (
        <div className="expandable-panel__wrapper">
            <ExpandablePanel
                title={
                    <div className="expandable-panel__title-wrapper">
                        <span className="expandable-panel__title-icon">
                            <ClosedLockIcon />
                        </span>
                        <span>Permanente rutelinjer</span>
                    </div>
                }
                defaultOpen={filteredLines.length > 0}
            >
                <div className="realtime-detail-panel__container">
                    {sortedLines.map(
                        ({ id, publicCode, transportMode, pointsOnLink }) => (
                            <div
                                className="realtime-detail-panel__buttons"
                                key={id}
                            >
                                <FilterChip
                                    value={id}
                                    checked={permanentlyVisibleRoutesInMap
                                        ?.map(
                                            (drawableRoute) =>
                                                drawableRoute.lineRef,
                                        )
                                        .includes(id)}
                                    onChange={() =>
                                        handleFilterChipOnChange(
                                            id,
                                            pointsOnLink,
                                            transportMode,
                                        )
                                    }
                                >
                                    {publicCode}
                                    <TransportModeIcon
                                        transportMode={transportMode}
                                    />
                                </FilterChip>
                            </div>
                        ),
                    )}
                </div>
            </ExpandablePanel>
        </div>
    )
}

export { PermanentLinesPanel }
