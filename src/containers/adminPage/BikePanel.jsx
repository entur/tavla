import React from 'react'
import { Checkbox } from '@entur/component-library'
import './styles.scss'
import BikePanelSearch from './searchPanels/BikePanelSearch.jsx'

const BikePanel = ({
    onCheck, updateHiddenList, stations, position, handleAddNewStation,
}) => (
    <div className="selection-panel">
        { stations.length > 0
            ? <div>
                <div className="search-stop-places">
                    <BikePanelSearch position={position} handleAddNewStation={handleAddNewStation}/>
                </div>
                <div className="city-bike-panel">
                    <div className="selection-panel-title">Bysykler</div>
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
                                                style={{
                                                    borderRadius: '12px',
                                                    height: '24px',
                                                    width: '24px',
                                                    marginTop: '3px',
                                                    cursor: 'pointer',
                                                }}
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

export default BikePanel
