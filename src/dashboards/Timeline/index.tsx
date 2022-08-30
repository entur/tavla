import React, { Fragment, useMemo, useEffect, useState, useRef } from 'react'

import { useRouteMatch } from 'react-router'

import { useLongPress } from 'use-long-press'

import { Heading2 } from '@entur/typography'
import { LegBone } from '@entur/travel'
import { LegMode } from '@entur/sdk'
import { colors } from '@entur/tokens'
import { WalkingIcon } from '@entur/icons'

import {
    getIcon,
    getIconColor,
    timeUntil,
    useCounter,
    getIconColorType,
    usePrevious,
    isEqualUnsorted,
    BREAKPOINTS,
} from '../../utils'
import { LineData, IconColorType } from '../../types'

import { useStopPlacesWithDepartures, useWalkInfo } from '../../logic'
import DashboardWrapper from '../../containers/DashboardWrapper'

import { useSettingsContext } from '../../settings'
import { WalkInfo } from '../../logic/useWalkInfo'

import RearrangeModal, { Item } from '../../components/RearrangeModal'
import {
    getFromLocalStorage,
    saveToLocalStorage,
} from '../../settings/LocalStorage'

import { LongPressProvider } from '../../logic/longPressContext'

import './styles.scss'

const TICKS = [-1, 0, 1, 2, 3, 4, 5, 10, 15, 20, 30, 60]

// Use this to scale the race track.
const ZOOM = 1

function diffSincePreviousTick(minute: number): number {
    if (minute <= 0) return -1 * minute
    const index = TICKS.indexOf(minute)
    if (index < 0) return 0
    const prev = TICKS[index - 1] || 0
    return minute - prev
}

function getWalkInfoForStopPlace(
    walkInfos: WalkInfo[] | undefined,
    id: string,
): WalkInfo | undefined {
    return walkInfos?.find((walkInfo) => walkInfo.stopId === id)
}

function formatWalkInfo(walkInfo: WalkInfo | undefined) {
    if (!walkInfo) return null
    if (walkInfo.walkTime / 60 < 1) {
        return `Mindre enn 1 min å gå (${Math.ceil(walkInfo.walkDistance)} m)`
    } else {
        return `${Math.ceil(walkInfo.walkTime / 60)} min å gå (${Math.ceil(
            walkInfo.walkDistance,
        )} m)`
    }
}

function competitorPosition(waitTime: number): number {
    const negativeTickOffset = Math.abs(
        TICKS.filter((tick) => tick < 0).reduce((a, b) => a + b, 0),
    )
    return ZOOM * (waitTime + negativeTickOffset * 60)
}

function walkMarkerPosition(walkTime: number): number {
    const offset = 30
    const roundedWalkTime = Math.ceil(walkTime / 60) * 60
    return competitorPosition(roundedWalkTime) + offset
}

function groupDeparturesByMode(departures: LineData[]): {
    [mode in LegMode]?: LineData[]
} {
    return departures.reduce(
        (map, departure) => ({
            ...map,
            [departure.type]: [...(map[departure.type] || []), departure],
        }),
        {} as { [mode in LegMode]?: LineData[] },
    )
}

const MODE_ORDER = ['rail', 'metro', 'tram', 'bus', 'water', 'air']

function orderModes(modeA: string, modeB: string): number {
    return MODE_ORDER.indexOf(modeA) - MODE_ORDER.indexOf(modeB)
}

function getLegBonePattern(
    mode: LegMode,
): 'line' | 'dashed' | 'dotted' | 'wave' {
    switch (mode) {
        case 'bus':
            return 'dashed'
        case 'bicycle':
            return 'dotted'
        case 'water':
            return 'wave'
        case 'metro':
        case 'rail':
        case 'tram':
        case 'air':
        default:
            return 'line'
    }
}

interface TickProps {
    minutes: number
    mode: LegMode
    index: number
}

function Tick({ minutes, mode, index }: TickProps): JSX.Element {
    const [settings] = useSettingsContext()
    const [color, setColor] = useState(colors.blues.blue30)
    let label = `${minutes} min`
    let marginLeft = -30

    if (minutes === 0) {
        label = 'Nå'
        marginLeft = -20
    }

    if (minutes < 0) {
        label = ''
    }

    useEffect(() => {
        if (settings && !(minutes < 0)) {
            setColor(getIconColor(mode, getIconColorType(settings.theme)))
        }
    }, [settings, minutes, mode])

    const width = diffSincePreviousTick(minutes) * (60 * ZOOM)

    return (
        <div style={{ minWidth: width }}>
            <LegBone
                direction="horizontal"
                className="timeline__leg-bone"
                pattern={getLegBonePattern(mode)}
                color={color}
                showStop={index <= TICKS.length}
                showStart={index === 0}
            />
            <div className="timeline__tick" style={{ marginLeft }}>
                {label}
            </div>
        </div>
    )
}

interface TimelineData {
    stopId: string
    name: string
    groupedDepartures: Array<[LegMode, LineData[]]>
}

const TimelineDashboard = (): JSX.Element | null => {
    useCounter()
    const stopPlacesWithDepartures = useStopPlacesWithDepartures()
    const [settings] = useSettingsContext()
    const [iconColorType, setIconColorType] = useState<IconColorType>(
        IconColorType.CONTRAST,
    )
    const [isLongPressStarted, setIsLongPressStarted] = useState<boolean>(false)
    const isCancelled = useRef<NodeJS.Timeout>()

    const boardId = useRouteMatch<{ documentId: string }>('/t/:documentId')
        ?.params?.documentId

    const [tileOrder, setTileOrder] = useState<Item[] | undefined>(
        boardId ? getFromLocalStorage(boardId + '-tile-order') : undefined,
    )
    const walkInfoDestinations = useMemo(() => {
        if (!stopPlacesWithDepartures) return []
        return stopPlacesWithDepartures.map((dep) => ({
            ...dep,
            place: dep.id,
        }))
    }, [stopPlacesWithDepartures])
    const walkInfo = useWalkInfo(walkInfoDestinations)
    const hideWalkInfo = settings?.hideWalkInfo

    const numberOfStopPlaces = stopPlacesWithDepartures?.length || 0
    const hasData = Boolean(stopPlacesWithDepartures?.length)
    const prevNumberOfStopPlaces = usePrevious(numberOfStopPlaces)
    const [modalVisible, setModalVisible] = useState(false)

    function clearLongPressTimeout() {
        setIsLongPressStarted(false)
        if (isCancelled.current) {
            clearTimeout(isCancelled.current)
        }
    }
    useEffect(() => {
        if (settings) {
            setIconColorType(getIconColorType(settings.theme))
        }
    }, [settings])

    const data: TimelineData[] = useMemo(
        () =>
            (stopPlacesWithDepartures || []).map(({ id, name, departures }) => {
                const groupedDepartures = Object.entries(
                    groupDeparturesByMode(departures.reverse()),
                ).sort(([modeA], [modeB]) =>
                    orderModes(modeA, modeB),
                ) as TimelineData['groupedDepartures']

                return {
                    stopId: id,
                    name,
                    groupedDepartures,
                }
            }),
        [stopPlacesWithDepartures],
    )

    useEffect(() => {
        let defaultTileOrder: Item[] = []
        if (stopPlacesWithDepartures) {
            if (stopPlacesWithDepartures.length === prevNumberOfStopPlaces) {
                return
            }
            defaultTileOrder = stopPlacesWithDepartures.map((item) => ({
                id: item.id,
                name: item.name,
            }))
        }
        const storedTileOrder: Item[] | undefined = getFromLocalStorage(
            boardId + '-tile-order',
        )
        if (
            storedTileOrder?.length === defaultTileOrder.length &&
            isEqualUnsorted(
                defaultTileOrder.map((item) => item.id),
                storedTileOrder?.map((item) => item.id),
            )
        ) {
            setTileOrder(storedTileOrder)
        } else {
            setTileOrder(defaultTileOrder)
        }
    }, [
        stopPlacesWithDepartures,
        hasData,
        settings?.showMap,
        boardId,
        prevNumberOfStopPlaces,
    ])

    const longPress = useLongPress(
        () => {
            setModalVisible(true)
        },
        {
            threshold: 750,
            onStart: () => {
                isCancelled.current = setTimeout(() => {
                    setIsLongPressStarted(true)
                }, 150)
            },
            onFinish: () => {
                clearLongPressTimeout()
            },
            onCancel: () => {
                clearLongPressTimeout()
            },
            onMove: () => {
                clearLongPressTimeout()
            },
            cancelOnMovement: true,
        },
    )
    function renderTile(item: TimelineData, tileItemId: string) {
        const { groupedDepartures, name, stopId } = item
        return (
            <div key={tileItemId} className="timeline__stop">
                <header className="timeline__header">
                    <Heading2 className="timeline__heading">{name}</Heading2>
                    {!hideWalkInfo && walkInfo ? (
                        <div className="timeline__walking-time">
                            {formatWalkInfo(
                                getWalkInfoForStopPlace(walkInfo || [], stopId),
                            )}
                        </div>
                    ) : undefined}
                </header>
                {!hideWalkInfo &&
                getWalkInfoForStopPlace(walkInfo || [], stopId) ? (
                    <div
                        className="timeline__walk-marker"
                        style={{
                            right: walkMarkerPosition(
                                getWalkInfoForStopPlace(walkInfo || [], stopId)
                                    ?.walkTime || 0,
                            ),
                        }}
                    >
                        <WalkingIcon />
                        <div className="timeline__walk-marker__line" />
                    </div>
                ) : null}
                {groupedDepartures.map(([mode, departures]) => (
                    <Fragment key={mode}>
                        <div className="timeline__track">
                            {departures.map(
                                ({
                                    id,
                                    type,
                                    expectedDepartureTime,
                                    route,
                                }) => {
                                    const waitTime = timeUntil(
                                        expectedDepartureTime,
                                    )
                                    const icon = getIcon(type, iconColorType)
                                    return (
                                        <div
                                            key={id}
                                            className="timeline__competitor"
                                            style={{
                                                right: competitorPosition(
                                                    waitTime,
                                                ),
                                            }}
                                        >
                                            <div className="timeline__label">
                                                {route}
                                            </div>
                                            {icon}
                                        </div>
                                    )
                                },
                            )}
                        </div>
                        <div className="timeline__line">
                            {[...TICKS].reverse().map((minutes, index) => (
                                <Tick
                                    key={minutes}
                                    mode={mode}
                                    minutes={minutes}
                                    index={index}
                                />
                            ))}
                        </div>
                    </Fragment>
                ))}
            </div>
        )
    }
    if (window.innerWidth < BREAKPOINTS.md) {
        if (!tileOrder) return null

        return (
            <DashboardWrapper
                className="timeline"
                stopPlacesWithDepartures={stopPlacesWithDepartures}
            >
                <LongPressProvider value={isLongPressStarted}>
                    <div className="timeline__body" {...longPress}>
                        <RearrangeModal
                            itemOrder={tileOrder}
                            onTileOrderChanged={(item) => {
                                setTileOrder(item)
                                saveToLocalStorage(
                                    boardId + '-tile-order',
                                    item,
                                )
                            }}
                            modalVisible={modalVisible}
                            onDismiss={() => setModalVisible(false)}
                        />
                        <>
                            {tileOrder.map((tileItem) => {
                                if (stopPlacesWithDepartures) {
                                    const stopIndex =
                                        stopPlacesWithDepartures.findIndex(
                                            (p) => p.id == tileItem.id,
                                        )
                                    const item = data[stopIndex]
                                    if (!item) return null

                                    return renderTile(item, tileItem.id)
                                }
                            })}
                        </>
                    </div>
                </LongPressProvider>
            </DashboardWrapper>
        )
    }

    return (
        <DashboardWrapper
            className="timeline"
            stopPlacesWithDepartures={stopPlacesWithDepartures}
        >
            <div className="timeline__body">
                {data.map(({ stopId, name, groupedDepartures }) => (
                    <div key={stopId} className="timeline__stop">
                        <header className="timeline__header">
                            <Heading2 className="timeline__heading">
                                {name}
                            </Heading2>
                            {!hideWalkInfo && walkInfo ? (
                                <div className="timeline__walking-time">
                                    {formatWalkInfo(
                                        getWalkInfoForStopPlace(
                                            walkInfo || [],
                                            stopId,
                                        ),
                                    )}
                                </div>
                            ) : undefined}
                        </header>
                        {!hideWalkInfo &&
                        getWalkInfoForStopPlace(walkInfo || [], stopId) ? (
                            <div
                                className="timeline__walk-marker"
                                style={{
                                    right: walkMarkerPosition(
                                        getWalkInfoForStopPlace(
                                            walkInfo || [],
                                            stopId,
                                        )?.walkTime || 0,
                                    ),
                                }}
                            >
                                <WalkingIcon />
                                <div className="timeline__walk-marker__line" />
                            </div>
                        ) : null}
                        {groupedDepartures.map(([mode, departures]) => (
                            <Fragment key={mode}>
                                <div className="timeline__track">
                                    {departures.map(
                                        ({
                                            id,
                                            type,
                                            expectedDepartureTime,
                                            route,
                                        }) => {
                                            const waitTime = timeUntil(
                                                expectedDepartureTime,
                                            )
                                            const icon = getIcon(
                                                type,
                                                iconColorType,
                                            )
                                            return (
                                                <div
                                                    key={id}
                                                    className="timeline__competitor"
                                                    style={{
                                                        right: competitorPosition(
                                                            waitTime,
                                                        ),
                                                    }}
                                                >
                                                    <div className="timeline__label">
                                                        {route}
                                                    </div>
                                                    {icon}
                                                </div>
                                            )
                                        },
                                    )}
                                </div>
                                <div className="timeline__line">
                                    {[...TICKS]
                                        .reverse()
                                        .map((minutes, index) => (
                                            <Tick
                                                key={minutes}
                                                mode={mode}
                                                minutes={minutes}
                                                index={index}
                                            />
                                        ))}
                                </div>
                            </Fragment>
                        ))}
                    </div>
                ))}
            </div>
        </DashboardWrapper>
    )
}

export default TimelineDashboard
