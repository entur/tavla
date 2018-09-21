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
        return (
            <div className="selection-panel">
                { stations.length > 0
                    ? <div>
                        <div className="search-stop-places">
                            <BikePanelSearch position={position} handleAddNewStation={handleAddNewStation}/>

                        </div>
                        <div className="city-bike-panel">
                            <div className="stop-place-header">
                                <div className="selection-panel-title">Bysykler</div>
                                <div className="checkbox-container-check-all">
                                    <Checkbox
                                        checked={this.state.checked}
                                        onChange={this.onChange}
                                        className="entur-radio-checkbox--squared"
                                    />
                                    <p>Velg alle</p>
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
                    : null}
            </div>
        )
    }
}

export default BikePanel
