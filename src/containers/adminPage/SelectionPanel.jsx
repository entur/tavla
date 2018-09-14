import React from 'react'
import {
    Accordion,
    AccordionItem,
    AccordionItemTitle,
    AccordionItemBody,
} from 'react-accessible-accordion'
import { getIcon } from '../../utils'
import { Checkbox } from '../../components'
import './styles.scss'

const SelectionPanel = ({
    onCheck, updateHiddenList, stops,
}) => (
    <div className="selection-panel">
        { (stops.length > 0)
            ? <div>
                <div className="search-stop-places"/>
                <div className="stop-place-panel">
                    {<div className="stop-place-header">
                        <div className="selection-panel-title">Stoppesteder</div>
                    </div>}
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
                                                        return (
                                                            <tr
                                                                className="admin-route-row"
                                                                key={i}
                                                                onClick={() => updateHiddenList(route, 'routes')}
                                                            >
                                                                <td className="admin-route-icon">{getIcon(type, { width: 28, height: 28 })}</td>
                                                                <td className="admin-route-title">{route}</td>
                                                                <td className="admin-route-button-container">
                                                                    <div className="admin-route-button">
                                                                        <div value={isVisible} className="close" />
                                                                    </div>
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

export default SelectionPanel
