import React from 'react'
import {
    distanceToMinutes,
} from '../../utils'

import MAX_DISTANCE_MINUTES from '../../constants'


const Slider = (props) => {
    return (
        <div>
            <input
                id="typeinp"
                type="range"
                min="1"
                max={MAX_DISTANCE_MINUTES}
                step="1"
                onChange={props.handleChange}
                className="slider"
                value={distanceToMinutes(props.distance)}
            />
            <div className="slider-labels">
                <div>1 min</div>
                <div>{MAX_DISTANCE_MINUTES} min</div>
            </div>
        </div>
    )
}

export default Slider
