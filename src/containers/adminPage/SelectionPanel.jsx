import React, { Component } from 'react'
import {
    Accordion,
    AccordionItem,
    AccordionItemTitle,
    AccordionItemBody,
} from 'react-accessible-accordion'
import { SlideSwitch, Checkbox } from '@entur/component-library'
import SelectionPanelSearch from './searchPanels/SelectionPanelSearch.jsx'
import { getIcon, getIconColor } from '../../utils'
import './styles.scss'

class SelectionPanel extends Component {
    state = {
        checked: false,
    }

    onChange = () => {
        this.props.updateHiddenListForAll(!this.state.checked, 'stops')
        this.setState({
            checked: !this.state.checked,
        })
    }

    render() {
        const {
            onCheck, updateHiddenList, stops, position, handleAddNewStop,
        } = this.props
        return (
            <div className="selection-panel">
                { (stops.length > 0)
                    ? <div>
                        <div className="search-stop-places">
                            <SelectionPanelSearch position={position} handleAddNewStop={handleAddNewStop}/>
                        </div>
                        <div className="stop-place-panel">
                            {<div className="stop-place-header">
                                <div className="selection-panel-title">Stoppesteder</div>
                                <div className="checkbox-container-check-all">
                                    <Checkbox
                                        id="check-all-stop-places"
                                        name="check-all-stop-places"
                                        label="Velg alle"
                                        onChange={this.onChange}
                                        checked={this.state.checked}
                                        className="entur-radio-checkbox--squared"
                                    />
                                </div>
                            </div>}
                            {
                                stops.map(({
                                    name, id, departures,
                                }, index) => {
                                    const isChecked = !onCheck(id, 'stops')
                                    return (
                                        <Accordion className="selection-row" accordion="true" key={index}>
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
                                                <AccordionItemTitle className="selection-data-container stop-place-container">
                                                    <div className="stop-place-title">
                                                        {name}
                                                    </div>
                                                    <div className="show-button">
                                                        <p className="show-button--text">Endre</p>
                                                        <div className="accordion__arrow" role="presentation" />
                                                    </div>
                                                </AccordionItemTitle>
                                                <div className="selection-data-wrapper--border" />
                                                <AccordionItemBody>
                                                    <table className="admin-route-table">
                                                        <tbody>
                                                            { departures.map(({ route, type }, i) => {
                                                                const isVisible = !onCheck(route, 'routes')
                                                                const Icon = getIcon(type)
                                                                const iconColor = getIconColor(type)
                                                                return (
                                                                    <tr
                                                                        className="admin-route-row"
                                                                        key={i}
                                                                    >
                                                                        <td className="admin-route-icon">
                                                                            <Icon height={ 28 } widht={ 28 } color={ iconColor } />
                                                                        </td>
                                                                        <td className="admin-route-title">{route}</td>
                                                                        <td>
                                                                            <SlideSwitch
                                                                                key={i}
                                                                                id="SlideSwitch"
                                                                                className="mode-sort-slide-switch-stops"
                                                                                onChange={() => { updateHiddenList(route, 'routes') }}
                                                                                checked={isVisible}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            }) }
                                                        </tbody>
                                                    </table>
                                                </AccordionItemBody>
                                            </AccordionItem>
                                        </Accordion>
                                    )
                                })
                            }
                        </div>
                    </div>
                    : null }
            </div>
        )
    }
}

export default SelectionPanel
