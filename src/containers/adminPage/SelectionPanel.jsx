import React from 'react'
import {
    Accordion,
    AccordionItem,
    AccordionItemTitle,
    AccordionItemBody,
} from 'react-accessible-accordion'
import { getIcon, onBlur } from '../../utils'
import { Checkbox } from '../../components'
import './styles.scss'

const SelectionPanel = ({
    onCheck, updateHiddenList, stops, stations,
}) => (
    <div className="selection-panel">
        { (stops.length > 0)
            ? <div className="stop-place-panel">
                <div className="selection-panel-title">Holdeplasser</div>
                {
                    stops.map(({
                        name, id, departures,
                    }, index) => {
                        const isChecked = !onCheck(id, 'stops')
                        return (
                            <Accordion className="selection-row" accordion="true" key={index}>
                                <div className="checkbox-container">
                                    <Checkbox key={id} id={id} value={isChecked} onChange={() => updateHiddenList(id, 'stops')}/>
                                </div>
                                <AccordionItem className="selection-data-wrapper" style={onBlur(isChecked)} key={id}>
                                    <AccordionItemTitle className="selection-data-container stop-place-container">
                                        <div className="stop-place-title">
                                            {name}
                                        </div>
                                        <div className="show-button">
                                            <div className="accordion__arrow" role="presentation" />
                                        </div>
                                    </AccordionItemTitle>
                                    <AccordionItemBody>
                                        <table className="admin-route-table">
                                            <tbody>
                                                { departures.map(({ route, type }, i) => {
                                                    const isVisible = !onCheck(route, 'routes')
                                                    return (
                                                        <tr style={onBlur(isVisible)} key={i}>
                                                            <td className="admin-route-icon">{getIcon(type)}</td>
                                                            <td className="admin-route-title">{route}</td>
                                                            <td className="admin-route-button-container">
                                                                <button className="admin-route-button" onClick={() => updateHiddenList(route, 'routes')}>
                                                                    <div value={isVisible} className="close" />
                                                                </button>
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
            : null }
        { stations.length > 0
            ? <div className="city-bike-panel">
                <div className="selection-panel-title">Bysykler</div>
                {
                    stations.map(({
                        name, id,
                    }, index) => {
                        const isChecked = !onCheck(id, 'stations')
                        return (
                            <div className="selection-row" key={index}>
                                <div className="checkbox-container">
                                    <Checkbox key={index} id={id} value={isChecked} onChange={() => updateHiddenList(id, 'stations')}/>
                                </div>
                                <div className="selection-data-wrapper" style={onBlur(isChecked)}>
                                    <div className="selection-data-container">
                                        <div className="city-bike-icon">{getIcon('bike', { height: 30, width: 30 })}</div>
                                        <div className="city-bike-name">{name}</div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            : null}
    </div>
)

export default SelectionPanel
