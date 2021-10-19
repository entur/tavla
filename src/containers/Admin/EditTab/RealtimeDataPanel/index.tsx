import React, { useCallback, useMemo } from 'react'

import { FilterChip } from '@entur/chip'
import { Switch, TravelSwitch } from '@entur/form'
import { Loader } from '@entur/loader'
import { Heading3, Label, Paragraph } from '@entur/typography'
import { ExpandablePanel } from '@entur/expand'
import { ClosedLockIcon } from '@entur/icons'

import { Line } from '../../../../types'
import {
    getIcon,
    isTransport,
    transportModeNameMapper,
} from '../../../../utils'

import { useSettingsContext } from '../../../../settings'

import './styles.scss'

interface Props {
    realtimeLines: Line[] | undefined
    hiddenLines: string[]
}

const RealtimeDataPanel = ({
    realtimeLines,
    hiddenLines,
}: Props): JSX.Element => {
    const [settings, setSettings] = useSettingsContext()

    const {
        showRoutesInMap,
        permanentlyVisibleRoutesInMap = [],
        hiddenRealtimeDataLineRefs = [],
    } = settings || {}

    const modes = useMemo(
        () =>
            [...new Set(realtimeLines?.map((line) => line.transportMode))].sort(
                (a, b) =>
                    transportModeNameMapper(a) > transportModeNameMapper(b)
                        ? 1
                        : -1,
            ),
        [realtimeLines],
    )

    const toggleRealtimeDataLineIds = useCallback(
        (lineId: string) => {
            if (hiddenRealtimeDataLineRefs.includes(lineId)) {
                setSettings({
                    hiddenRealtimeDataLineRefs:
                        hiddenRealtimeDataLineRefs.filter(
                            (el) => el !== lineId,
                        ),
                    hideRealtimeData: false,
                })
            } else {
                setSettings({
                    hiddenRealtimeDataLineRefs: [
                        ...hiddenRealtimeDataLineRefs,
                        lineId,
                    ],
                    hideRealtimeData: false,
                })
            }
        },
        [hiddenRealtimeDataLineRefs, setSettings],
    )

    return !realtimeLines ? (
        <Loader>Laster...</Loader>
    ) : realtimeLines.length > 0 ? (
        <div className="realtime-detail-panel">
            <div className="realtime-detail-panel__realtime-selection-panel">
                {modes.map((mode) => (
                    <div className="expandable-panel__wrapper" key={mode}>
                        <ExpandablePanel
                            title={
                                <div className="expandable-panel__title-wrapper">
                                    <span className="expandable-panel__title-name">
                                        {transportModeNameMapper(mode)}
                                    </span>
                                    <span onClick={(e) => e.stopPropagation()}>
                                        <TravelSwitch
                                            transport={
                                                isTransport(mode) ? mode : 'bus'
                                            }
                                            size="large"
                                            checked={realtimeLines
                                                .filter(
                                                    ({ transportMode }) =>
                                                        transportMode === mode,
                                                )
                                                .some(
                                                    ({ id }) =>
                                                        !hiddenLines.includes(
                                                            id,
                                                        ),
                                                )}
                                            onChange={() =>
                                                realtimeLines
                                                    .filter(
                                                        ({ transportMode }) =>
                                                            transportMode ===
                                                            mode,
                                                    )
                                                    .some(
                                                        ({ id }) =>
                                                            !hiddenLines.includes(
                                                                id,
                                                            ),
                                                    )
                                                    ? setSettings({
                                                          hiddenRealtimeDataLineRefs:
                                                              [
                                                                  ...hiddenRealtimeDataLineRefs,
                                                                  ...realtimeLines
                                                                      .filter(
                                                                          ({
                                                                              transportMode,
                                                                          }) =>
                                                                              transportMode ===
                                                                              mode,
                                                                      )
                                                                      .map(
                                                                          ({
                                                                              id,
                                                                          }) =>
                                                                              id,
                                                                      ),
                                                              ],
                                                          hideRealtimeData:
                                                              false,
                                                      })
                                                    : setSettings({
                                                          hiddenRealtimeDataLineRefs:
                                                              hiddenRealtimeDataLineRefs.filter(
                                                                  (ref) =>
                                                                      !realtimeLines
                                                                          .filter(
                                                                              ({
                                                                                  transportMode,
                                                                              }) =>
                                                                                  transportMode ===
                                                                                  mode,
                                                                          )
                                                                          .map(
                                                                              ({
                                                                                  id,
                                                                              }) =>
                                                                                  id,
                                                                          )
                                                                          .includes(
                                                                              ref,
                                                                          ),
                                                              ),
                                                          hideRealtimeData:
                                                              false,
                                                      })
                                            }
                                        />
                                    </span>
                                </div>
                            }
                        >
                            <div className="realtime-detail-panel__container">
                                {realtimeLines
                                    .filter(
                                        (line) => line.transportMode === mode,
                                    )
                                    .map(
                                        ({ id, publicCode, transportMode }) => (
                                            <div
                                                className="realtime-detail-panel__buttons"
                                                key={id}
                                            >
                                                <FilterChip
                                                    value={id}
                                                    onChange={() =>
                                                        toggleRealtimeDataLineIds(
                                                            id,
                                                        )
                                                    }
                                                    checked={
                                                        !hiddenLines.includes(
                                                            id,
                                                        )
                                                    }
                                                >
                                                    {publicCode}
                                                    {getIcon(transportMode)}
                                                </FilterChip>
                                            </div>
                                        ),
                                    )}
                            </div>
                        </ExpandablePanel>
                    </div>
                ))}
            </div>
            <div className="realtime-detail-panel__route-selection-wrapper">
                <Heading3>Rutelinje</Heading3>
                <Label>
                    Pek på et posisjonsikon for å se ruten i kartet. Trykk på
                    posisjonsikonet for å vise ruten permanent.
                </Label>
                <div className="realtime-detail-panel__route-display-selection">
                    <span className="realtime-detail-panel__route-display-selection-info-text">
                        Vis rutelinjer i kartet
                    </span>
                    <Switch
                        checked={showRoutesInMap}
                        onChange={() => {
                            setSettings({
                                showRoutesInMap: !showRoutesInMap,
                                hideRealtimeData: false,
                            })
                        }}
                    ></Switch>
                </div>
                {showRoutesInMap && (
                    <div className="expandable-panel__wrapper">
                        <ExpandablePanel
                            title={
                                <div className="expandable-panel__title-wrapper">
                                    <span className="expandable-panel__title-icon">
                                        <ClosedLockIcon></ClosedLockIcon>
                                    </span>
                                    <span>Permanente rutelinjer</span>
                                </div>
                            }
                            defaultOpen={
                                realtimeLines.filter(
                                    (line) =>
                                        !hiddenRealtimeDataLineRefs.includes(
                                            line.id,
                                        ),
                                ).length > 0
                            }
                        >
                            <div className="realtime-detail-panel__container">
                                {realtimeLines
                                    .filter(
                                        (line) =>
                                            !hiddenRealtimeDataLineRefs.includes(
                                                line.id,
                                            ),
                                    )
                                    .sort((a, b) =>
                                        transportModeNameMapper(
                                            a.transportMode,
                                        ) +
                                            a.publicCode >
                                        transportModeNameMapper(
                                            b.transportMode,
                                        ) +
                                            b.publicCode
                                            ? 1
                                            : -1,
                                    )
                                    .map(
                                        ({
                                            id,
                                            publicCode,
                                            transportMode,
                                            pointsOnLink,
                                        }) => (
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
                                                        permanentlyVisibleRoutesInMap
                                                            ?.map(
                                                                (
                                                                    drawableRoute,
                                                                ) =>
                                                                    drawableRoute.lineRef,
                                                            )
                                                            .includes(id)
                                                            ? setSettings({
                                                                  permanentlyVisibleRoutesInMap:
                                                                      permanentlyVisibleRoutesInMap.filter(
                                                                          (
                                                                              route,
                                                                          ) =>
                                                                              route.lineRef !==
                                                                              id,
                                                                      ),
                                                                  hideRealtimeData:
                                                                      false,
                                                              })
                                                            : setSettings({
                                                                  permanentlyVisibleRoutesInMap:
                                                                      [
                                                                          ...permanentlyVisibleRoutesInMap,
                                                                          {
                                                                              lineRef:
                                                                                  id,
                                                                              pointsOnLink,
                                                                              mode: transportMode,
                                                                          },
                                                                      ],
                                                                  hideRealtimeData:
                                                                      false,
                                                              })
                                                    }
                                                >
                                                    {publicCode}
                                                    {getIcon(transportMode)}
                                                </FilterChip>
                                            </div>
                                        ),
                                    )}
                            </div>
                        </ExpandablePanel>
                    </div>
                )}
            </div>
        </div>
    ) : (
        <Paragraph>
            Ingen sanntidsdata å vise for stasjonene og modusene som er valgt.
        </Paragraph>
    )
}

export default RealtimeDataPanel
