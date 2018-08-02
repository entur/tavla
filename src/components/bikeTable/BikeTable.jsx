import React from 'react'
import { getIcon } from '../../utils'
import './styles.scss'

const BikeTable = ({ stationData, visible }) => {
    const { hiddenModes, hiddenStations } = visible
    if (hiddenModes.includes('bike')) {
        return null
    }
    const stations = stationData
        .filter(({ id }) => !hiddenStations.includes(id))
        .sort((a, b) => a.name.localeCompare(b.name))
    return (
        <div className="tile-container bike-tile-container">
            <div className="bike-header-container">
                <div className="stop-header-icons">{getIcon('bike', { height: 90, width: 90 })}</div>
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
                                <p>{bikesAvailable}</p>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default BikeTable
