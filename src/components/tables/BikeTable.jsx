import React from 'react'
import { getIcon, compareStrings } from '../../utils'
import './styles.css'

const BikeTable = ({ stationData }) => {
    return (
        <div className="tile-container">
            <div className="citybike-header-container">
                <div className="citybike-header-item">{getIcon('bike', { height: 70, color: '#ff5956' })}</div>
                <div className="citybike-header-item"><h2>Bysykkel</h2></div>
            </div>
            {
                stationData.sort((a, b) => compareStrings(a.name, b.name)).map(({
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
