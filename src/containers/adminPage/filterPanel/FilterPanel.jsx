import React from 'react'
import { DistanceInput, Slider } from '../../../components'
import TransportRow from './TransportRow.jsx'

const FilterPanel = ({
    transportModes, distance, handleSliderChange, handleTextInputChange, updateHiddenList, hiddenModes,
}) => (
    <div className="filter-panel">
        <div className="find-nearby-container">
            <div className="distance-container">
                <p className="distance-text">Hvis meg stoppesteder innenfor
                    <DistanceInput
                        handleChange={handleTextInputChange}
                        distance={distance}
                    />
                minuters avstand
                </p>
                <Slider handleChange={handleSliderChange} distance={distance} />
            </div>
        </div>
        <div className="transport-container">
            <p className="filter-panel--title">Transportmidler</p>
            <div className="filter-container">
                <div className="mode-sort-container">
                    { transportModes.map((mode, index) => (
                        <TransportRow
                            key={index}
                            index={index}
                            mode={mode}
                            updateHiddenList={updateHiddenList}
                            transportModes={transportModes}
                            hiddenModes={hiddenModes}
                        />
                    ))}
                </div>
            </div>
        </div>
    </div>
)

export default FilterPanel
