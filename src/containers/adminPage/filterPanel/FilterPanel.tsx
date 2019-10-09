import React from 'react'
import { LegMode } from '@entur/sdk'
import { DistanceInput, Slider } from '../../../components'
import TransportRow from './TransportRow'

const FilterPanel = ({
    transportModes, distance, handleSliderChange, handleTextInputChange, updateHiddenList, hiddenModes,
}: Props): JSX.Element => (
    <div className="filter-panel">
        <div className="find-nearby-container">
            <div className="distance-container">
                <p className="distance-text">Vis meg stoppesteder innenfor
                    <DistanceInput
                        handleChange={handleTextInputChange}
                        distance={distance}
                    />
                meters avstand
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
                            hiddenModes={hiddenModes}
                        />
                    ))}
                </div>
            </div>
        </div>
    </div>
)

interface Props {
    transportModes: Array<LegMode>,
    distance: number,
    handleSliderChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    handleTextInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    updateHiddenList: (mode: LegMode, type: 'transportModes') => void,
    hiddenModes: Array<LegMode>,
}

export default FilterPanel
