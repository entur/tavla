import React, { useState, useEffect, useCallback } from 'react'
import { SlideSwitch } from '@entur/component-library'
import { getIcon, getIconColor } from '../../../utils'

const TransportRow = ({ mode, index, hiddenModes, updateHiddenList }) => {
    const [checked, setChecked] = useState(true)

    useEffect(() => {
        hiddenModes.forEach(_mode => {
            if (_mode === mode) {
                setChecked(false)
            }
        })
    }, [mode, hiddenModes, setChecked])

    const handleOnChecked = useCallback(
        (newMode, transportModes) => () => {
            updateHiddenList(newMode, transportModes)
            setChecked(v => !v)
        },
        [setChecked, updateHiddenList],
    )

    const getTransportModeTitle = type => {
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

    const Icon = getIcon(mode)
    const iconColor = getIconColor(mode)

    return (
        <div className="mode-sort-row">
            <div className="sort-button-item" key={index}>
                <div className="mode-sort-button mode-sort-icon">
                    <Icon height={24} width={24} color={iconColor} />
                </div>
                <p className="mode-sort-text">{getTransportModeTitle(mode)}</p>
            </div>
            <SlideSwitch
                id="SlideSwitch"
                className="mode-sort-slide-switch"
                onChange={handleOnChecked(mode, 'transportModes')}
                checked={checked}
                style={{ cursor: 'pointer' }}
            />
        </div>
    )
}

export default TransportRow
