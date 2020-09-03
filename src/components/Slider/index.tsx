import React, { useRef, useEffect } from 'react'
import { MAX_DISTANCE } from '../../constants'

import './styles.scss'

function Slider(props: Props): JSX.Element {
    const sliderRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (sliderRef.current) {
            sliderRef.current.style.setProperty(
                '--slider-progress',
                String(props.distance / MAX_DISTANCE),
            )
        }
    }, [props.distance])

    return (
        <div className="slider" ref={sliderRef}>
            <input
                id="typeinp"
                type="range"
                min={props.min}
                max={props.max}
                step={props.step} //"1"
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
    min: number
    max: number
    step: number
    distance: number
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default Slider
