import React, { memo, useCallback } from 'react'
import ReactMapGL, { Marker } from 'react-map-gl'

import { Vehicle } from '@entur/sdk/lib/mobility/types'

import { Slider } from '../../../../components'
import { DEFAULT_ZOOM } from '../../../../constants'
import { useSettingsContext } from '../../../../settings'
import ScooterOperatorLogo from '../../../../assets/icons/scooterOperatorLogo'
import PositionPin from '../../../../assets/icons/positionPin'

import './styles.scss'

function ZoomEditor(props: Props): JSX.Element {
    const [settings, setSettings] = useSettingsContext()
    const { zoom, onZoomUpdated } = props

    const { latitude = 0, longitude = 0 } = settings?.coordinates || {}

    const handleSliderChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const newZoom = Number(event.target.value)
            onZoomUpdated(newZoom)
            setSettings({
                zoom: newZoom,
            })
        },
        [onZoomUpdated, setSettings],
    )

    return (
        <div className="zoom-editor">
            <ReactMapGL
                latitude={latitude}
                longitude={longitude}
                zoom={zoom || DEFAULT_ZOOM}
                mapboxAccessToken={process.env.MAPBOX_TOKEN}
                mapStyle={process.env.MAPBOX_STYLE_MAPVIEW}
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
                                  operator={sctr.system.operator}
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
    scooters: Vehicle[] | undefined
}

export default memo<Props>(ZoomEditor)
