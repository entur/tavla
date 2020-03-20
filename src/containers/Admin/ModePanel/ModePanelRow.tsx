import React, { useCallback } from 'react'

import { Switch } from '@entur/form'
import { LegMode, TransportSubmode } from '@entur/sdk'

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
        case 'air':
            return 'Fly'
        default:
            return type
    }
}

const ModePanelRow = ({
    mode,
    subMode,
    onChange,
    value,
}: Props): JSX.Element => {
    const Icon = getIcon(mode, subMode)
    const iconColor = getIconColor(mode, subMode)

    const handleChange = useCallback(() => {
        onChange(mode)
    }, [mode, onChange])

    return (
        <div className="mode-panel-row">
            <div>
                <div>
                    {Icon ? (
                        <Icon height={24} width={24} color={iconColor} />
                    ) : null}
                </div>
                <span className="mode-panel-row__label">
                    {getTransportModeTitle(mode)}
                </span>
            </div>
            <Switch onChange={handleChange} checked={value} />
        </div>
    )
}

interface Props {
    mode: LegMode
    subMode?: TransportSubmode
    value: boolean
    onChange: (mode: LegMode) => void
}

export default ModePanelRow
