import React from 'react'
import { getIcon } from '../../utils'
import './bikeTable.css'

const BikeTable = ({ stationData, visible }) => {
    const stations = stationData
        .filter(({ id }) => !visible.includes(id))
        .sort((a, b) => a.name.localeCompare(b.name))
    return (
        <div className="bike-tile-container">
            <div className="bike-header-container">
                <div>{getIcon('bike', { height: 60, width: 60 })}</div>
                <div><h2>Bysykkel</h2></div>
            </div>
            {
                stations.map(({
                    name, bikesAvailable, id,
                }) => (
                    <div key={id} className="bike-container">
                        <h4 className="bike-station-title">{name}</h4>
                        <div className="available">
                            {getIcon('bike')}
                            <div className="bike-available-text">
                                {bikesAvailable}
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default BikeTable
