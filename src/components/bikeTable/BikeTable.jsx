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
        <div className="tile-container">
            <div className="bike-header-container">
                <div className="stop-header-icons">{getIcon('bike', { height: 45, width: 45, color: '#9BA4D2' })}</div>
                <p className="bike-header--text">Bysykkel</p>
            </div>
            {
                stations.map(({
                    name, bikesAvailable, id, spacesAvailable,
                }) => (
                    <div key={id} className="bike-container">
                        <div className="bike-station-wrapper">
                            <div className="route-icon">{getIcon('bike', { height: 35, width: 35, color: '#9BA4D2' })}</div>
                            <p>{name}</p>
                        </div>

                        <div className="available">
                            <p>{bikesAvailable} sykler</p>
                            <p>{spacesAvailable} låser</p>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default BikeTable
