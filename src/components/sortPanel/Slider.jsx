import React from 'react'
import {
    distanceToMinutes,
} from '../../utils'

import { MAX_DISTANCE } from '../../constants'


const Slider = (props) => {
    return (
        <div>
            <input
                id="typeinp"
                type="range"
                min="1"
                max={MAX_DISTANCE}
                step="1"
                onChange={props.handleChange}
                className="slider"
                value={distanceToMinutes(props.distance)}
            />
            <div className="slider-labels">
                <p>1 min</p>
                <p>{MAX_DISTANCE} min</p>
            </div>
        </div>
    )
}

export default Slider
