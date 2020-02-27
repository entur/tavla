import React from 'react'
import { MAX_DISTANCE } from '../../constants'

import './styles.scss'

function Slider(props: Props): JSX.Element {
    return (
        <div className="slider">
            <input
                id="typeinp"
                type="range"
                min="1"
                max={MAX_DISTANCE}
                step="1"
                onChange={props.handleChange}
                className="slider"
                value={props.distance}
            />
            <div className="slider__labels">
                <div>1 m</div>
                <div>{MAX_DISTANCE} m</div>
            </div>
        </div>
    )
}

interface Props {
    distance: number
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default Slider
