import React from 'react'
import { MAX_DISTANCE } from '../../constants'

const DistanceInput = (props) => {
    return (
        <input
            type="number"
            value={props.distance}
            className="distance-input"
            onChange={props.handleChange}
            min="1"
            max={MAX_DISTANCE}
        />
    )
}

export default DistanceInput
