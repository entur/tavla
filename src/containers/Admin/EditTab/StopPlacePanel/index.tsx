import React, { useCallback, useMemo, useState } from 'react'

import { ExpandablePanel } from '@entur/expand'
import { Checkbox, TravelSwitch, TravelSwitchProps } from '@entur/form'

import { getIcon, toggleValueInList, unique } from '../../../../utils'
import { StopPlaceWithLines } from '../../../../types'
import { useSettingsContext } from '../../../../settings'

import './styles.scss'
import { Paragraph } from '@entur/typography'
import { LegMode } from '@entur/sdk'

function StopPlacePanel(props: Props): JSX.Element {
    const [
        settings,
        { setHiddenStops, setHiddenRoutes, setHiddenModes },
    ] = useSettingsContext()

    const { hiddenModes, hiddenStops, hiddenRoutes } = settings

    const { stops } = props

    const filteredStopPlaces = useMemo(
        () => stops.filter(({ lines }) => lines.length > 0),
        [stops],
    )

    const onChooseAllPressed = useCallback(() => {
        if (hiddenStops.length > 0) {
            setHiddenStops([])
        } else {
            setHiddenStops(stops.map(({ id }) => id))
        }
    }, [hiddenStops.length, setHiddenStops, stops])

    const onToggleStop = useCallback(
        (event) => {
            const stopId = event.target.id
            const newDisabledList = toggleValueInList(hiddenStops, stopId)
            setHiddenStops(newDisabledList)
        },
        [hiddenStops, setHiddenStops],
    )

    const onToggleRoute = useCallback(
        (stopPlaceId: string, routeName: string) => {
            const newHiddenRoutes = {
                ...hiddenRoutes,
                [stopPlaceId]: toggleValueInList(
                    hiddenRoutes[stopPlaceId] || [],
                    routeName,
                ),
            }
            setHiddenRoutes(newHiddenRoutes)
        },
        [hiddenRoutes, setHiddenRoutes],
    )

    const isRouteSelected = useCallback(
        (stopPlaceId, routeName) => {
            return (
                !hiddenRoutes[stopPlaceId] ||
                !hiddenRoutes[stopPlaceId].includes(routeName)
            )
        },
        [hiddenRoutes],
    )

    const onToggleAllLines = useCallback(
        (stopPlaceId: string): void => {
            const stop = stops.find(({ id }) => id === stopPlaceId)
            const lines = stop ? stop.lines : []
            const lineNames = lines.map(({ name }) => name)
            const allWereSelected = lines.every((line) =>
                isRouteSelected(stopPlaceId, line.name),
            )

            let newHiddenRoutesForStop

            if (allWereSelected) {
                newHiddenRoutesForStop = [
                    ...(hiddenRoutes[stopPlaceId] || []),
                    ...lineNames,
                ]
            } else {
                newHiddenRoutesForStop = (
                    hiddenRoutes[stopPlaceId] || []
                ).filter((name) => !lineNames.includes(name))
            }

            setHiddenRoutes({
                ...hiddenRoutes,
                [stopPlaceId]: newHiddenRoutesForStop,
            })
        },
        [hiddenRoutes, isRouteSelected, setHiddenRoutes, stops],
    )

    const onToggleMode = useCallback(
        (stopPlaceId: string, mode: LegMode): void => {
            setHiddenModes({
                ...hiddenModes,
                [stopPlaceId]: toggleValueInList(
                    hiddenModes[stopPlaceId] || [],
                    mode,
                ),
            })
        },
        [setHiddenModes, hiddenModes],
    )

    if (!filteredStopPlaces.length) {
        return (
            <div className="stop-place-panel">
                <div className="stop-place-panel__header">
                    <Paragraph>Det er ingen stoppesteder i nærheten.</Paragraph>
                </div>
            </div>
        )
    }

    return (
        <div className="stop-place-panel">
            <div className="stop-place-panel__header">
                <div className="stop-place-panel__checkall">
                    <Checkbox
                        id="check-all-stop-places"
                        name="check-all-stop-places"
                        onChange={onChooseAllPressed}
                        checked={!hiddenStops.length}
                    >
                        Velg alle
                    </Checkbox>
                </div>
            </div>
            {filteredStopPlaces.map(({ name, id, lines }) => {
                return (
                    <div key={id} className="stop-place-panel__row">
                        <Checkbox
                            id={id}
                            className="stop-place-panel__row__checkbox"
                            checked={!hiddenStops.includes(id)}
                            onChange={onToggleStop}
                        />
                        <ExpandablePanel
                            className="stop-place-panel__row__expandable"
                            title={
                                <div className="stop-place-panel__row__header">
                                    <span
                                        onClick={(event) =>
                                            event.stopPropagation()
                                        }
                                    >
                                        {unique(
                                            lines.map(
                                                (line) => line.transportMode,
                                            ),
                                        ).map((mode) => (
                                            <TravelSwitch
                                                key={mode}
                                                transport={
                                                    mode as TravelSwitchProps['transport']
                                                }
                                                onChange={(event): void => {
                                                    onToggleMode(id, mode)
                                                }}
                                                checked={
                                                    !hiddenModes[id]?.includes(
                                                        mode,
                                                    )
                                                }
                                            />
                                        ))}
                                    </span>
                                    <span>{name}</span>
                                </div>
                            }
                        >
                            <Checkbox
                                id={`checkbox-all-lines-${id}`}
                                checked={lines.every((line) =>
                                    isRouteSelected(id, line.name),
                                )}
                                onChange={(): void => onToggleAllLines(id)}
                                className="stop-place-panel__route-checkbox"
                            >
                                Velg alle
                            </Checkbox>
                            {lines
                                .filter(
                                    (line) =>
                                        !hiddenModes[id]?.includes(
                                            line.transportMode,
                                        ),
                                )
                                .map(
                                    ({
                                        name: routeName,
                                        transportMode,
                                        transportSubmode,
                                    }) => {
                                        const routeId = `${id}-${routeName}`
                                        const icon = getIcon(
                                            transportMode,
                                            transportSubmode,
                                        )

                                        return (
                                            <Checkbox
                                                key={`checkbox-${routeId}`}
                                                id={`checkbox-${routeId}`}
                                                className="stop-place-panel__route"
                                                name={routeName}
                                                onChange={(): void =>
                                                    onToggleRoute(id, routeName)
                                                }
                                                checked={isRouteSelected(
                                                    id,
                                                    routeName,
                                                )}
                                            >
                                                {icon}
                                                {routeName}
                                            </Checkbox>
                                        )
                                    },
                                )}
                        </ExpandablePanel>
                    </div>
                )
            })}
        </div>
    )
}

interface Props {
    stops: StopPlaceWithLines[]
}

export default StopPlacePanel
