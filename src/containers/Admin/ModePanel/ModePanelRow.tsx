import React, { useCallback } from 'react'
import { SlideSwitch, COLORS } from '@entur/component-library'
import { LegMode } from '@entur/sdk'

import { getIcon, getIconColor } from '../../../utils'

import './styles.scss'

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

const ModePanelRow = ({ mode, onChange, value }: Props): JSX.Element => {
    const Icon = getIcon(mode)
    const iconColor = getIconColor(mode)

    const handleChange = useCallback(() => {
        onChange(mode)
    }, [mode, onChange])

    return (
        <div className="mode-panel-row">
            <div>
                <div>
                    { Icon ? <Icon height={24} width={24} color={iconColor} /> : null }
                </div>
                <span className="mode-panel-row__label">{ getTransportModeTitle(mode) }</span>
            </div>
            <SlideSwitch
                id="SlideSwitch"
                onChange={handleChange}
                checked={value}
                color={COLORS.MINT}
                style={{ cursor: 'pointer' }}
                variant="midnight"
            />
        </div>
    )
}

interface Props {
    mode: LegMode,
    value: boolean,
    onChange: (mode: LegMode) => void,
}

export default ModePanelRow
