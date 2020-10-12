import React, { useState } from 'react'
import ReactMapGL, { Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

import { Scooter } from '@entur/sdk'
import { useSettingsContext } from '../../../settings'

import ScooterOperatorLogo from '../../../assets/icons/scooterOperatorLogo'
import PositionPin from '../../../assets/icons/positionPin'

import './styles.scss'
import { DEFAULT_ZOOM } from '../../../constants'

function ScooterTile({ scooters }: Props): JSX.Element {
    const [settings] = useSettingsContext()
    const [viewport] = useState({
        latitude: settings?.coordinates?.latitude,
        longitude: settings?.coordinates?.longitude,
        width: 'auto',
        height: '100%',
        zoom: settings?.zoom ?? DEFAULT_ZOOM,
    })

    return (
        <div className="scootertile">
            <ReactMapGL
                {...viewport}
                mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
                mapStyle={process.env.MAPBOX_STYLE}
            >
                <Marker
                    latitude={viewport.latitude || 0}
                    longitude={viewport.longitude || 0}
                >
                    <PositionPin size="24" />
                </Marker>
                {scooters.map((sctr) => (
                    <Marker
                        key={sctr.id}
                        latitude={sctr.lat}
                        longitude={sctr.lon}
                    >
                        <ScooterOperatorLogo logo={sctr.operator} size="24" />
                    </Marker>
                ))}
            </ReactMapGL>
        </div>
    )
}

interface Props {
    scooters: Scooter[]
}

export default ScooterTile
