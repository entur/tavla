import React, { useState } from 'react'
import ReactMapGL, { Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

import { Scooter } from '@entur/sdk'
import { colors } from '@entur/tokens'
import { ScooterIcon } from '@entur/icons'
import { useSettingsContext } from '../../../settings'

import { Heading2 } from '@entur/typography'
import ScooterOperatorLogo from '../../../assets/icons/scooterOperatorLogo'

import './styles.scss'

function ScooterTile({ scooters }: Props): JSX.Element {
    const [settings] = useSettingsContext()

    const [viewport] = useState({
        latitude: settings?.coordinates?.latitude,
        longitude: settings?.coordinates?.longitude,
        width: 'auto',
        height: '55vh',
        zoom: 15.5,
    })

    return (
        <div className="scootertile">
            <header className="scootertile__header">
                <Heading2>Sparkesykler</Heading2>
                <div className="scootertile__header-icons">
                    <ScooterIcon color={colors.blues.blue60} />
                </div>
            </header>
            <ReactMapGL
                {...viewport}
                mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
                mapStyle={process.env.MAPBOX_STYLE}
            >
                {scooters.map((sctr) => (
                    <Marker
                        key={sctr.id}
                        latitude={sctr.lat}
                        longitude={sctr.lon}
                    >
                        <ScooterOperatorLogo
                            logo={sctr.operator}
                            width="32px"
                        />
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
