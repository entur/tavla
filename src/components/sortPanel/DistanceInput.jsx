import React from 'react'
import {
    distanceToMinutes,
} from '../../utils'

import { MAX_DISTANCE } from '../../constants'

const DistanceInput = (props) => {
    return (
        <input
            type="number"
            value={props.distance !== null ? distanceToMinutes(props.distance) : ''}
            className="distance-input"
            onChange={props.handleChange}
            min="1"
            max={MAX_DISTANCE}
        />
    )
}

export default DistanceInput
