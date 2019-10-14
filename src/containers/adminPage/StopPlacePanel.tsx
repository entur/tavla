import React, { useCallback, useMemo } from 'react'
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion'
import { SlideSwitch, Checkbox } from '@entur/component-library'

import { getIcon, getIconColor, toggleValueInList } from '../../utils'
import { StopPlaceWithLines } from '../../types'
import { useSettingsContext } from '../../settings'

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

    const onToggleRoute = useCallback((event) => {
        const routeName = event.target.name
        const newDisabledList = toggleValueInList(hiddenRoutes, routeName)
        setHiddenRoutes(newDisabledList)
    }, [hiddenRoutes, setHiddenRoutes])

    if (!filteredStopPlaces.length) {
        return <div className="selection-panel" />
    }

    return (
        <div className="stop-place-panel">
            <div className="stop-place-header">
                <div className="selection-panel-title">Stoppesteder</div>
                <div className="checkbox-container-check-all">
                    <Checkbox
                        id="check-all-stop-places"
                        name="check-all-stop-places"
                        label="Velg alle"
                        onChange={onChooseAllPressed}
                        checked={!hiddenStops.length}
                        className="entur-radio-checkbox--squared"
                    />
                </div>
            </div>
            {
                filteredStopPlaces.map(({ name, id, lines }) => {
                    return (
                        <Accordion className="selection-row" key={id} allowZeroExpanded>
                            <div className="checkbox-container">
                                <Checkbox
                                    id={id}
                                    className="entur-radio-checkbox--round"
                                    checked={!hiddenStops.includes(id)}
                                    onChange={onToggleStop}
                                    variant="midnight"
                                />
                            </div>
                            <AccordionItem className="selection-data-wrapper">
                                <AccordionItemHeading>
                                    <AccordionItemButton className="selection-data-container stop-place-container">
                                        <div className="stop-place-title">
                                            {name}
                                        </div>
                                        <div className="show-button">
                                            <p className="show-button--text">Endre</p>
                                            <div className="accordion__arrow" role="presentation" />
                                        </div>
                                    </AccordionItemButton>
                                </AccordionItemHeading>
                                <div className="selection-data-wrapper--border" />
                                <AccordionItemPanel>
                                    <table className="admin-route-table">
                                        <tbody>
                                            { lines.map(({ name: routeName, transportMode }) => {
                                                const routeId = `${id}-${routeName}`
                                                const Icon = getIcon(transportMode)
                                                const iconColor = getIconColor(transportMode)

                                                return (
                                                    <tr className="admin-route-row" key={routeId}>
                                                        <td className="admin-route-icon">
                                                            <Icon height={ 28 } width={ 28 } color={ iconColor } />
                                                        </td>
                                                        <td className="admin-route-title">{routeName}</td>
                                                        <td>
                                                            <SlideSwitch
                                                                id="SlideSwitch"
                                                                name={routeName}
                                                                className="mode-sort-slide-switch-stops"
                                                                onChange={onToggleRoute}
                                                                checked={!hiddenRoutes.includes(routeName)}
                                                            />
                                                        </td>
                                                    </tr>
                                                )
                                            }) }
                                        </tbody>
                                    </table>
                                </AccordionItemPanel>
                            </AccordionItem>
                        </Accordion>
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
