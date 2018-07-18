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
                <div>{getIcon('bike', { height: 60, color: '#ff5956' })}</div>
                <div><h2>Bysykkel</h2></div>
            </div>
            {
                stations.map(({
                    name, bikesAvailable, spacesAvailable, id,
                }) => (
                    <div key={id} className="bike-container">
                        <div>
                            <h4>{name}</h4>
                        </div>
                        <div className="bike-station-container">
                            <div className="available">
                                <div className="bike-station-icon">
                                    {getIcon('bike', { color: '#ff5956', height: '30' })}
                                </div>
                                {bikesAvailable}
                            </div>
                            <div className="available">
                                <div className="bike-station-icon">
                                    {getIcon('lock', { color: '#ff5956', height: '30' })}
                                </div>  {spacesAvailable}
                            </div>
                        </div>
                        <div />
                    </div>
                ))
            }
        </div>
    )
}

export default BikeTable
