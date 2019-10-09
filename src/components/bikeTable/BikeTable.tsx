import React from 'react'
import { BikeRentalStation } from '@entur/sdk'

import { Settings } from '../../types'
import { getIcon } from '../../utils'
import './styles.scss'

const BikeTable = ({ stationData, visible }: Props): JSX.Element => {
    const { hiddenModes, hiddenStations } = visible
    if (hiddenModes.includes('bicycle')) {
        return null
    }
    const stations = stationData
        .filter(({ id }) => !hiddenStations.includes(id))
        .sort((a, b) => a.name.localeCompare(b.name))

    const BikeIcon = getIcon('bicycle')
    return (
        <div className="tile-container">
            <div className="bike-header-container">
                <div className="stop-header-icons"><BikeIcon height={ 32 } width={ 32 } color={'#9BA4D2'}/></div>
                <p className="bike-header--text">Bysykkel</p>
            </div>
            {
                stations.map(({
                    name, bikesAvailable, id, spacesAvailable,
                }) => (
                    <div key={id} className="bike-container">
                        <div className="bike-station-wrapper">
                            <div className="route-icon"><BikeIcon height={ 24 } width={ 24 } color={'#D1D4E3'}/></div>
                            <p>{name}</p>
                        </div>

                        <div className="available">
                            <p>{bikesAvailable} {bikesAvailable === 1 ? 'sykkel' : 'sykler'}</p>
                            <p>{spacesAvailable} {spacesAvailable === 1 ? 'lås' : 'låser'}</p>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

interface Props {
    stationData: Array<BikeRentalStation>,
    visible: Settings,
}

export default BikeTable
