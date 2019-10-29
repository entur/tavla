import React, { memo, useCallback } from 'react'

import { Slider } from '../../../components'
import { MAX_DISTANCE } from '../../../constants'

import './styles.scss'

function DistanceEditor(props: Props): JSX.Element {
    const { distance, onDistanceUpdated } = props

    const handleDistanceUpdate = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        onDistanceUpdated(Number(event.target.value))
    }, [onDistanceUpdated])

    return (
        <div className="distance-editor">
            <p className="distance-editor__text">
                Vis stopp og stativer innen
                <input
                    type="number"
                    value={distance}
                    className="distance-editor__input"
                    onChange={handleDistanceUpdate}
                    min="1"
                    max={MAX_DISTANCE}
                />
                meter.
            </p>
            <Slider handleChange={handleDistanceUpdate} distance={distance} />
        </div>
    )
}

interface Props {
    distance: number,
    onDistanceUpdated: (newDistance: number) => void,
}

export default memo<Props>(DistanceEditor)
