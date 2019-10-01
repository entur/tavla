import React, { useState } from 'react'
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion'
import { SlideSwitch, Checkbox } from '@entur/component-library'
import SelectionPanelSearch from './searchPanels/SelectionPanelSearch.jsx'
import { getIcon, getIconColor, getCombinedStopPlaceAndRouteId } from '../../utils'
import './styles.scss'

function SelectionPanel(props) {
    const [checked, setChecked] = useState(false)

    const {
        onCheck, updateHiddenList, stops, position, handleAddNewStop,
    } = props

    const onChange = () => {
        props.updateHiddenListForAll(!checked, 'stops')
        setChecked(!checked)
        if (stops.filter(({id}) => !onCheck(id, 'stops') !== checked).length > 0)
          setChecked(!checked);
        
    }

    return (
        <div className="selection-panel">
            {(stops.length > 0)
                ? <div>
                    <div className="search-stop-places">
                        <SelectionPanelSearch position={position} handleAddNewStop={handleAddNewStop} />
                    </div>
                    <div className="stop-place-panel">
                        <div className="stop-place-header">
                            <div className="selection-panel-title">Stoppesteder</div>
                            <div className="checkbox-container-check-all">
                                <Checkbox
                                    id="check-all-stop-places"
                                    name="check-all-stop-places"
                                    label="Velg alle"
                                    onChange={onChange}
                                    checked={checked}
                                    className="entur-radio-checkbox--squared"
                                />
                            </div>
                        </div>
                        {
                            stops.map(({
                                name, id, departures,
                            }, index) => {
                                const isChecked = !onCheck(id, 'stops')
                                return (
                                    <Accordion className="selection-row" key={index} allowZeroExpanded>
                                        <div className="checkbox-container">
                                            <Checkbox
                                                id={id}
                                                className="entur-radio-checkbox--round"
                                                checked={isChecked}
                                                onChange={() => updateHiddenList(id, 'stops')}
                                                variant="midnight"
                                            />
                                        </div>
                                        <AccordionItem
                                            className="selection-data-wrapper"
                                            key={id}
                                        >
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
                                                        {departures.map(({ route, type }, i) => {
                                                            const isVisible = !onCheck(getCombinedStopPlaceAndRouteId(id, route), 'routes')
                                                            const Icon = getIcon(type)
                                                            const iconColor = getIconColor(type)
                                                            return (
                                                                <tr
                                                                    className="admin-route-row"
                                                                    key={i}
                                                                >
                                                                    <td className="admin-route-icon">
                                                                        <Icon height={28} width={28} color={iconColor} />
                                                                    </td>
                                                                    <td className="admin-route-title">{route}</td>
                                                                    <td>
                                                                        <SlideSwitch
                                                                            key={i}
                                                                            id="SlideSwitch"
                                                                            className="mode-sort-slide-switch-stops"
                                                                            onChange={() => {
                                                                                const comboId = getCombinedStopPlaceAndRouteId(id, route)
                                                                                updateHiddenList(comboId, 'routes')
                                                                            }}
                                                                            checked={isVisible}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                </table>
                                            </AccordionItemPanel>
                                        </AccordionItem>
                                    </Accordion>
                                )
                            })
                        }
                    </div>
                </div>
                : null}
        </div>
    )
}

export default SelectionPanel
