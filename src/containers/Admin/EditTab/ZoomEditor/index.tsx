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
        zoom: settings?.zoom ?? DEFAULT_ZOOM,
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
            <Label>Justér zoom-nivå i kartet</Label>
            <Slider
                handleChange={handleZoomUpdate}
                value={zoom}
                min={13.5}
                max={18}
                step={0.1}
            />
            <div style={{ marginBottom: '0.5rem' }}></div>
            <ReactMapGL
                {...viewport}
                mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
                mapStyle={process.env.MAPBOX_STYLE}
            />
        </div>
    )
}

interface Props {
    zoom: number
    onZoomUpdated: (newZoom: number) => void
}

export default memo<Props>(ZoomEditor)
