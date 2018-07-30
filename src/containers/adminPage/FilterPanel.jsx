import React from 'react'
import { getIcon } from '../../utils'
import { DistanceInput, Slider } from '../../components'

function getTransportModeTitle(type) {
    switch (type) {
        case 'bus':
            return 'Buss'
        case 'tram':
            return 'Trikk'
        case 'bike':
            return 'Bysykkel'
        case 'water':
            return 'Ferje'
        case 'rail':
            return 'Tog'
        case 'metro':
            return 'T-bane'
        default:
            return type
    }
}


const FilterPanel = ({
    isHidden, transportModes, distance, handleSliderChange, handleTextInputChange, updateHiddenList, getStyle,
}) => (
    <div className="filter-panel">
        <p>Finn holdeplasser i nærheten</p>
        <div className="filter-container">
            <p className="filter-text">Hva vil du se?</p>
            <div className="mode-sort-container">
                { transportModes.map((mode, index) => (
                    <div className="sort-button-item" key={index}>
                        <button
                            className="mode-sort-button"
                            style={getStyle(!isHidden(mode, 'modes'))}
                            onClick={() => updateHiddenList(mode, 'transportModes')}
                        >
                            { getIcon(mode, { color: '#EFD358', height: 50, width: 50 }) }
                        </button>
                        <p className="mode-sort-text">{getTransportModeTitle(mode)}</p>
                    </div>
                ))}
            </div>
        </div>
        <div className="find-nearby-container">
            <div className="distance-container">
                <p className="filter-text">Hvor langt vil du gå?</p>
                <DistanceInput handleChange={handleTextInputChange} distance={distance}/>
                <Slider handleChange={handleSliderChange} distance={distance} />
            </div>
        </div>
    </div>
)

export default FilterPanel
