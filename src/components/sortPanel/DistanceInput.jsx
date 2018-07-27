import React from 'react'
import {
    distanceToMinutes,
} from '../../utils'

import { MAX_DISTANCE_MINUTES } from '../../constants'

const DistanceInput = (props) => {
    return (
        <p>Maks gangavstand til holdeplass er ca.
            <input
                type="number"
                value={props.distance !== null ? distanceToMinutes(props.distance) : ''}
                className="distance-input"
                onChange={props.handleChange}
                min="1"
                max={MAX_DISTANCE_MINUTES}
            />
        min</p>
    )
}

export default DistanceInput
