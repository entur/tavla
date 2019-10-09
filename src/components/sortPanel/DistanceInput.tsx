import React from 'react'
import { MAX_DISTANCE } from '../../constants'

const DistanceInput = (props: Props): JSX.Element => {
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

interface Props {
    distance: number,
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
}

export default DistanceInput
