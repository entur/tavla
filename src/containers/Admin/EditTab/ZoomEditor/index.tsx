import React, { memo, useCallback } from 'react'
import ReactMapGL, { Marker } from 'react-map-gl'

import { Scooter } from '@entur/sdk'

import { Slider } from '../../../../components'
import { DEFAULT_ZOOM } from '../../../../constants'
import { useSettingsContext } from '../../../../settings'
import ScooterOperatorLogo from '../../../../assets/icons/scooterOperatorLogo'
import PositionPin from '../../../../assets/icons/positionPin'

import './styles.scss'

function ZoomEditor(props: Props): JSX.Element {
    const [settings, { setZoom }] = useSettingsContext()
    const { zoom, onZoomUpdated } = props

    const { latitude = 0, longitude = 0 } = settings?.coordinates || {}

    const handleSliderChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const newZoom = Number(event.target.value)
            onZoomUpdated(newZoom)
            setZoom(newZoom)
        },
        [onZoomUpdated, setZoom],
    )

    return (
        <div className="zoom-editor">
            <div style={{ marginBottom: '0.5rem' }}></div>
            <ReactMapGL
                latitude={latitude}
                longitude={longitude}
                width="auto"
                height="40vh"
                zoom={zoom || DEFAULT_ZOOM}
                mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
                mapStyle={process.env.MAPBOX_STYLE}
                className="settings-map"
            >
                <Marker latitude={latitude} longitude={longitude}>
                    <PositionPin size={24} />
                </Marker>
                {props.scooters
                    ? props.scooters.map((sctr) => (
                          <Marker
                              key={sctr.id}
                              latitude={sctr.lat}
                              longitude={sctr.lon}
                          >
                              <ScooterOperatorLogo
                                  logo={sctr.operator}
                                  size={24}
                              />
                          </Marker>
                      ))
                    : []}
            </ReactMapGL>
            <Slider
                handleChange={handleSliderChange}
                value={zoom}
                min={13.5}
                max={18}
                step={0.1}
            />
        </div>
    )
}

interface Props {
    zoom: number
    onZoomUpdated: (newZoom: number) => void
    scooters: Scooter[] | null
}

export default memo<Props>(ZoomEditor)
