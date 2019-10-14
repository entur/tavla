import React, { useCallback } from 'react'
import { LegMode } from '@entur/sdk'
import { DistanceInput, Slider } from '../../../components'
import TransportRow from './TransportRow'
import { toggleValueInList } from '../../../utils'


const FilterPanel = ({
    transportModes, distance, onDistanceUpdated, onModesChange, disabledModes,
}: Props): JSX.Element => {
    const handleDistanceUpdate = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        onDistanceUpdated(Number(event.target.value))
    }, [onDistanceUpdated])

    const onModeToggled = (mode: LegMode): void => {
        onModesChange(toggleValueInList(disabledModes, mode))
    }

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
                                value={!disabledModes.includes(mode)}
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
    disabledModes: Array<LegMode>,
    distance: number,
    onDistanceUpdated: (newDistance: number) => void,
    onModesChange: (disabledModes: Array<LegMode>) => void,
}

export default FilterPanel
