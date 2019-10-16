import React, { useCallback, useMemo } from 'react'

import {
    SlideSwitch, Checkbox, Expandable, COLORS,
} from '@entur/component-library'

import { getIcon, getIconColor, toggleValueInList } from '../../../utils'
import { StopPlaceWithLines } from '../../../types'
import { useSettingsContext } from '../../../settings'

import './styles.scss'

function StopPlacePanel(props: Props): JSX.Element {
    const [settings, { setHiddenStops, setHiddenRoutes }] = useSettingsContext()

    const { hiddenModes, hiddenStops, hiddenRoutes } = settings

    const { stops } = props

    const filteredStopPlaces = useMemo(
        () => stops
            .map(stopPlace => ({
                ...stopPlace,
                lines: stopPlace.lines.filter(({ transportMode }) => !hiddenModes.includes(transportMode)),
            }))
            .filter(({ lines }) => lines.length > 0),
        [hiddenModes, stops]
    )

    const onChooseAllPressed = useCallback(() => {
        if (hiddenStops.length > 0) {
            setHiddenStops([])
        } else {
            setHiddenStops(stops.map(({ id }) => id))
        }
    }, [hiddenStops.length, setHiddenStops, stops])

    const onToggleStop = useCallback((event) => {
        const stopId = event.target.id
        const newDisabledList = toggleValueInList(hiddenStops, stopId)
        setHiddenStops(newDisabledList)
    }, [hiddenStops, setHiddenStops])

    const onToggleRoute = useCallback((stopPlaceId: string, routeName: string) => {
        const newHiddenRoutes = {
            ...hiddenRoutes,
            [stopPlaceId]: toggleValueInList(hiddenRoutes[stopPlaceId] || [], routeName),
        }
        setHiddenRoutes(newHiddenRoutes)
    }, [hiddenRoutes, setHiddenRoutes])

    if (!filteredStopPlaces.length) {
        return <div className="selection-panel" />
    }

    return (
        <div className="stop-place-panel">
            <div className="stop-place-panel__header">
                <h2>Stoppesteder</h2>
                <div className="stop-place-panel__checkall">
                    <Checkbox
                        id="check-all-stop-places"
                        name="check-all-stop-places"
                        label="Velg alle"
                        onChange={onChooseAllPressed}
                        checked={!hiddenStops.length}
                        variant="midnight"
                    />
                </div>
            </div>
            {
                filteredStopPlaces.map(({ name, id, lines }) => {
                    return (
                        <div className="stop-place-panel__row">
                            <Checkbox
                                id={id}
                                className="stop-place-panel__row__checkbox"
                                checked={!hiddenStops.includes(id)}
                                onChange={onToggleStop}
                                variant="midnight"
                            />
                            <Expandable
                                variant="midnight"
                                className="stop-place-panel__row__expandable"
                                title={(
                                    <div className="stop-place-panel__row__header">
                                        <span>{ name }</span>
                                    </div>
                                )}
                            >
                                { lines.map(({ name: routeName, transportMode }) => {
                                    const routeId = `${id}-${routeName}`
                                    const Icon = getIcon(transportMode)
                                    const iconColor = getIconColor(transportMode)

                                    return (
                                        <div
                                            className="stop-place-panel__route"
                                            key={routeId}
                                        >
                                            <div className="stop-place-panel__route__name">
                                                <Icon height={ 28 } width={ 28 } color={ iconColor } />
                                                <span>{routeName}</span>
                                            </div>
                                            <SlideSwitch
                                                id="SlideSwitch"
                                                name={routeName}
                                                color={COLORS.MINT}
                                                onChange={(): void => onToggleRoute(id, routeName)}
                                                checked={!hiddenRoutes[id] || !hiddenRoutes[id].includes(routeName)}
                                                variant="midnight"
                                            />
                                        </div>
                                    )
                                }) }
                            </Expandable>
                        </div>
                    )
                })
            }
        </div>
    )
}

interface Props {
    stops: Array<StopPlaceWithLines>,
}

export default StopPlacePanel
