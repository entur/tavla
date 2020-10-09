import React, { useRef, useEffect } from 'react'

import './styles.scss'

function Slider(props: Props): JSX.Element {
    const sliderRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (sliderRef.current) {
            sliderRef.current.style.setProperty(
                '--slider-progress',
                String((props.value - props.min) / (props.max - props.min)),
            )
        }
    }, [props.value, props.max, props.min])

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
                value={props.value}
            />
        </div>
    )
}

interface Props {
    min: number
    max: number
    step: number
    value: number
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default Slider
