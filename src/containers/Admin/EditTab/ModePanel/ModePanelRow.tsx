import React, { useCallback, useState, useEffect } from 'react'

import { Switch } from '@entur/form'
import { LegMode, TransportSubmode } from '@entur/sdk'

import { getIcon } from '../../../../utils'

import './styles.scss'
import { useSettingsContext } from '../../../../settings'

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
    const [settings] = useSettingsContext()
    const [contrast, setContrast] = useState<boolean>(false)

    useEffect(() => {
        if (
            settings &&
            (settings.theme === 'dark' || settings.theme === 'default')
        ) {
            setContrast(true)
        }
        if (
            settings &&
            !(settings.theme === 'dark' || settings.theme === 'default')
        ) {
            setContrast(false)
        }
    }, [settings])

    const handleChange = useCallback(() => {
        onChange(mode)
    }, [mode, onChange])

    return (
        <div className="mode-panel-row">
            <div>
                <div className="mode-panel-row__icon">
                    {getIcon(mode, contrast, subMode)}
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
