import React from 'react'
import Slider from './Slider'
import DistanceInput from './DistanceInput'

const SortPanel = (props) => {
    return (
        <div className="find-nearby-container">
            <p>Finn holdeplasser i nærheten</p>
            <div className="distance-container">
                <p>Hvor langt vil du gå?</p>
                <DistanceInput handleChange={props.handleTextInputChange} distance={props.distance}/>
                <Slider handleChange={props.handleSliderChange} distance={props.distance} />
            </div>
        </div>
    )
}

export default SortPanel
