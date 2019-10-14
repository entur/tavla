import React, { useCallback } from 'react'
import { SlideSwitch } from '@entur/component-library'
import { LegMode } from '@entur/sdk'

import { getIcon, getIconColor } from '../../../utils'

const getTransportModeTitle = (type: LegMode): string => {
    switch (type) {
        case 'bus':
            return 'Buss'
        case 'tram':
            return 'Trikk'
        case 'bicycle':
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

const TransportRow = ({ mode, onChange, value }: Props): JSX.Element => {
    const Icon = getIcon(mode)
    const iconColor = getIconColor(mode)

    const handleChange = useCallback(() => {
        onChange(mode)
    }, [mode, onChange])

    return (
        <div className="mode-sort-row">
            <div className="sort-button-item">
                <div className="mode-sort-button mode-sort-icon">
                    { Icon ? <Icon height={24} width={24} color={iconColor} /> : null }
                </div>
                <p className="mode-sort-text">{getTransportModeTitle(mode)}</p>
            </div>
            <SlideSwitch
                id="SlideSwitch"
                className="mode-sort-slide-switch"
                onChange={handleChange}
                checked={value}
                style={{ cursor: 'pointer' }}
            />
        </div>
    )
}

interface Props {
    mode: LegMode,
    value: boolean,
    onChange: (mode: LegMode) => void,
}

export default TransportRow
