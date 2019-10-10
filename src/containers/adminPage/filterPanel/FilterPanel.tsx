import React, { useCallback } from 'react'
import { LegMode } from '@entur/sdk'
import { DistanceInput, Slider } from '../../../components'
import TransportRow from './TransportRow'


const FilterPanel = ({
    transportModes, distance, onDistanceUpdated, onModeToggled, hiddenModes,
}: Props): JSX.Element => {
    const handleDistanceUpdate = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        onDistanceUpdated(Number(event.target.value))
    }, [onDistanceUpdated])

    return (
        <div className="filter-panel">
            <div className="find-nearby-container">
                <div className="distance-container">
                    <p className="distance-text">
                        Vis meg stoppesteder innenfor
                        <DistanceInput
                            handleChange={handleDistanceUpdate}
                            distance={distance}
                        />
                        meters avstand
                    </p>
                    <Slider handleChange={handleDistanceUpdate} distance={distance} />
                </div>
            </div>
            <div className="transport-container">
                <p className="filter-panel--title">Transportmidler</p>
                <div className="filter-container">
                    <div className="mode-sort-container">
                        { transportModes.map((mode, index) => (
                            <TransportRow
                                key={index}
                                mode={mode}
                                value={!hiddenModes.includes(mode)}
                                onChange={onModeToggled}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

interface Props {
    transportModes: Array<LegMode>,
    distance: number,
    onDistanceUpdated: (newDistance: number) => void,
    onModeToggled: (mode: LegMode) => void,
    hiddenModes: Array<LegMode>,
}

export default FilterPanel
