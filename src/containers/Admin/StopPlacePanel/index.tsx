import React, { useCallback, useMemo } from 'react'

import { ExpandablePanel } from '@entur/expand'
import { Checkbox } from '@entur/form'

import { getIcon, getIconColor, toggleValueInList } from '../../../utils'
import { StopPlaceWithLines } from '../../../types'
import { useSettingsContext } from '../../../settings'

import './styles.scss'

function StopPlacePanel(props: Props): JSX.Element {
    const [settings, { setHiddenStops, setHiddenRoutes }] = useSettingsContext()

    const { hiddenModes, hiddenStops, hiddenRoutes } = settings

    const { stops } = props

    const filteredStopPlaces = useMemo(
        () =>
            stops
                .map(stopPlace => ({
                    ...stopPlace,
                    lines: stopPlace.lines.filter(
                        ({ transportMode }) =>
                            !hiddenModes.includes(transportMode),
                    ),
                }))
                .filter(({ lines }) => lines.length > 0),
        [hiddenModes, stops],
    )

    const onChooseAllPressed = useCallback(() => {
        if (hiddenStops.length > 0) {
            setHiddenStops([])
        } else {
            setHiddenStops(stops.map(({ id }) => id))
        }
    }, [hiddenStops.length, setHiddenStops, stops])

    const onToggleStop = useCallback(
        event => {
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
            const allWereSelected = lines.every(line =>
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
                ).filter(name => !lineNames.includes(name))
            }

            setHiddenRoutes({
                ...hiddenRoutes,
                [stopPlaceId]: newHiddenRoutesForStop,
            })
        },
        [hiddenRoutes, isRouteSelected, setHiddenRoutes, stops],
    )

    if (!filteredStopPlaces.length) {
        return (
            <div className="stop-place-panel">
                <div className="stop-place-panel__header">
                    <h2>Stoppesteder</h2>
                </div>
            </div>
        )
    }

    return (
        <div className="stop-place-panel">
            <div className="stop-place-panel__header">
                <h2>Stoppesteder</h2>
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
                            variant="midnight"
                            className="stop-place-panel__row__expandable"
                            title={
                                <div className="stop-place-panel__row__header">
                                    <span>{name}</span>
                                </div>
                            }
                        >
                            <Checkbox
                                id={`checkbox-all-lines-${id}`}
                                checked={lines.every(line =>
                                    isRouteSelected(id, line.name),
                                )}
                                onChange={(): void => onToggleAllLines(id)}
                                className="stop-place-panel__route-checkbox"
                            >
                                Velg alle
                            </Checkbox>
                            {lines.map(
                                ({
                                    name: routeName,
                                    transportMode,
                                    transportSubmode,
                                }) => {
                                    const routeId = `${id}-${routeName}`
                                    const Icon = getIcon(
                                        transportMode,
                                        transportSubmode,
                                    )
                                    const iconColor = getIconColor(
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
                                            <Icon
                                                height={28}
                                                width={28}
                                                color={iconColor}
                                            />
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
    stops: Array<StopPlaceWithLines>
}

export default StopPlacePanel
