import React from 'react'
import {
    Accordion,
    AccordionItem,
    AccordionItemTitle,
    AccordionItemBody,
} from 'react-accessible-accordion'
import RouteList from './RouteList'
import './styles.scss'

class StopPlacePanel extends React.Component {
    state = {
        showMoreId: '',
    }

    onShowMoreClick(id) {
        if (this.state.showMoreId === id) {
            this.setState({
                showMoreId: '',
            })
        }
        else {
            this.setState({
                showMoreId: id,
            })
        }
    }

    render() {
        const {
            onCheck, getStyle, updateHiddenList, stops,
        } = this.props
        return (
            <div className="stop-place-panel">
                <div className="stop-place-panel-title">Holdeplasser</div>
                {
                    stops.map(({
                        name, id, departures,
                    }) => {
                        const isChecked = !onCheck(id, 'stops')
                        return (
                            <Accordion className="stop-place" accordion="true">
                                <div className="checkbox-container">
                                    <div>
                                        <input
                                            type="checkbox"
                                            className="checkbox"
                                            id={id}
                                            value={isChecked}
                                            onChange={() => updateHiddenList(id, 'stops')}
                                        />
                                        <label htmlFor={id}/>
                                    </div>
                                </div>
                                <AccordionItem className="stop-place-container" style={getStyle(isChecked)} key={id}>
                                    <AccordionItemTitle className="stop-place-row">
                                        <div className="stop-place-title">
                                            {name}
                                        </div>
                                        <div className="show-button">
                                            <div className="accordion__arrow" role="presentation" />
                                        </div>
                                    </AccordionItemTitle>
                                    <AccordionItemBody>
                                        <RouteList
                                            departures={departures}
                                            updateHiddenList={updateHiddenList}
                                            getStyle={getStyle}
                                            onCheck={onCheck}
                                        />
                                    </AccordionItemBody>
                                </AccordionItem>
                            </Accordion>
                        )
                    })
                }
            </div>
        )
    }
}

export default StopPlacePanel
