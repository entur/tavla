import React, { Component } from 'react'
import { Checkbox } from '@entur/component-library'
import './styles.scss'
import BikePanelSearch from './searchPanels/BikePanelSearch.jsx'

class BikePanel extends Component {
    state = {
        checked: false,
    }

    onChange = () => {
        this.props.updateHiddenListForAll(!this.state.checked, 'stations')
        this.setState({
            checked: !this.state.checked,
        })
    }

    render() {
        const {
            onCheck, updateHiddenList, stations,
            position, handleAddNewStation,
        } = this.props

        if (!stations.length) {
            return <div className="selection-panel"/>
        }

        return (
            <div className="selection-panel">
                <div>
                    <div className="search-stop-places">
                        <BikePanelSearch position={position} handleAddNewStation={handleAddNewStation}/>

                    </div>
                    <div className="city-bike-panel">
                        <div className="stop-place-header">
                            <div className="selection-panel-title">Bysykler</div>
                            <div className="checkbox-container-check-all">
                                <Checkbox
                                    id="check-all-stop-places-bike"
                                    name="check-all-stop-places-bike"
                                    label="Velg alle"
                                    className="entur-radio-checkbox--squared"
                                    onChange={this.onChange}
                                    checked={this.state.checked}
                                />
                            </div>
                        </div>
                        {
                            stations.map(({
                                name, id,
                            }, index) => {
                                const isChecked = !onCheck(id, 'stations')
                                return (
                                    <div key={index}>
                                        <div className="selection-row" key={index}>
                                            <div className="checkbox-container">
                                                <Checkbox
                                                    key={id}
                                                    id={id}
                                                    checked={isChecked}
                                                    onChange={() => updateHiddenList(id, 'stations')}
                                                    className="entur-radio-checkbox--round entur-radio-checkbox--margin"
                                                    variant="midnight"
                                                />
                                            </div>
                                            <div className="selection-data-wrapper">
                                                <div className="selection-data-container">
                                                    <div className="city-bike-name">{name}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="city-bike-row-bottom-border" />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default BikePanel
