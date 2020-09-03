import React, { memo, useCallback } from 'react'

import { Slider } from '../../../../components'

import './styles.scss'
import { Label } from '@entur/typography'
import { MAX_DISTANCE } from '../../../../constants'

function DistanceEditor(props: Props): JSX.Element {
    const { distance, onDistanceUpdated } = props

    const handleDistanceUpdate = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onDistanceUpdated(Number(event.target.value))
        },
        [onDistanceUpdated],
    )

    return (
        <div className="distance-editor">
            <Label>Hvor langt unna vil du inkludere stoppesteder?</Label>
            <Slider
                handleChange={handleDistanceUpdate}
                value={distance}
                min={1}
                max={MAX_DISTANCE}
                step={1}
            />
            <div className="slider__labels">
                <div>1 m</div>
                <div>{MAX_DISTANCE} m</div>
            </div>
            <p className="distance-editor__text">
                Viser stoppesteder innenfor <b>{distance}</b> m avstand.
            </p>
        </div>
    )
}

interface Props {
    distance: number
    onDistanceUpdated: (newDistance: number) => void
}

export default memo<Props>(DistanceEditor)
