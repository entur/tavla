import React from 'react'
import { MAX_DISTANCE } from '../../constants'

const Slider = (props: Props): JSX.Element => {
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
                value={props.distance}
            />
            <div className="slider-labels">
                <p>1 m</p>
                <p>{MAX_DISTANCE} m</p>
            </div>
        </div>
    )
}

interface Props {
    distance: number,
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
}

export default Slider
