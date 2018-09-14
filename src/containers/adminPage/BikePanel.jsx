import React from 'react'
import { Checkbox } from '../../components'
import './styles.scss'

const BikePanel = ({
    onCheck, updateHiddenList, stations,
}) => (
    <div className="selection-panel">
        { stations.length > 0
            ? <div>
                <div className="search-stop-places"/>
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
                                            <Checkbox key={id} id={id} value={isChecked} onChange={() => updateHiddenList(id, 'stations')}/>
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
