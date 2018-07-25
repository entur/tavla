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
    constructor(props) {
        super(props)
        this.state = {
            showMoreId: '',
        }
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
            <div className="stops">
                <div className="stop-place-table">
                    <div>
                        <div>
                            <div>Holdeplasser</div>
                        </div>
                    </div>
                    {
                        stops.map(({
                            name, id, departures,
                        }) => {
                            const isChecked = !onCheck(id, 'stops')
                            return (
                                <Accordion className="stop-place" accordion="true">
                                    <div className="checkbox-container">
                                        <input
                                            type="checkbox"
                                            className="checkbox"
                                            id={id}
                                            value={isChecked}
                                            onChange={() => updateHiddenList(id, 'stops')}
                                        />
                                        <label for={id}/>
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
            </div>
        )
    }
}

export default StopPlacePanel
