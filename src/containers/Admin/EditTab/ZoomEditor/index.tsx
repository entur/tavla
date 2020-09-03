import React, { memo, useCallback, useState } from 'react'
import ReactMapGL from 'react-map-gl'

import { Slider } from '../../../../components'

import './styles.scss'
import { Label } from '@entur/typography'
import { DEFAULT_ZOOM } from '../../../../constants'
import { useSettingsContext } from '../../../../settings'

function ZoomEditor(props: Props): JSX.Element {
    const [settings, { setZoom }] = useSettingsContext()
    const { zoom, onZoomUpdated } = props
    const [viewport, setViewPort] = useState({
        latitude: settings?.coordinates?.latitude,
        longitude: settings?.coordinates?.longitude,
        width: 'auto',
        height: '40vh',
        zoom: settings?.zoom ? settings?.zoom : DEFAULT_ZOOM,
    })

    const handleZoomUpdate = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onZoomUpdated(Number(event.target.value))
            setZoom(Number(event.target.value))
            setViewPort({
                latitude: settings?.coordinates?.latitude,
                longitude: settings?.coordinates?.longitude,
                width: 'auto',
                height: '40vh',
                zoom: settings?.zoom ? settings?.zoom : DEFAULT_ZOOM,
            })
        },
        [onZoomUpdated, setZoom, settings],
    )

    return (
        <div className="zoom-editor">
            <Label>Hvor langt unna vil du at kartet skal være zoomet?</Label>
            <Slider
                handleChange={handleZoomUpdate}
                distance={zoom}
                min={13.5}
                max={18}
                step={0.1}
            />
            <p className="zoom-editor__text">
                Kartet er zoomet in med nivå{' '}
                <b>{Math.round((zoom - 12.5) * 10) / 10}</b>.
            </p>
            <ReactMapGL
                {...viewport}
                mapboxApiAccessToken="pk.eyJ1IjoiZW50dXIiLCJhIjoiY2tlaWgyMGdwMTJoOTJ1bHB5aW92YTh3dSJ9.eDtvqlDi6C7fhXxmjqeN2Q"
                mapStyle="mapbox://styles/entur/cj9fk2u1w0a1p2sqlrkmxp685"
            />
        </div>
    )
}

interface Props {
    zoom: number
    onZoomUpdated: (newZoom: number) => void
}

export default memo<Props>(ZoomEditor)
