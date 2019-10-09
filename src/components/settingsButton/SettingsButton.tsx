import React from 'react'
import { SettingsIcon } from '@entur/component-library'

import './styles.scss'

function SettingsButton({ onClick }: Props): JSX.Element {
    return (
        <button className="settings-button" onClick={onClick}>
            <SettingsIcon size="small" />
        </button>
    )
}

interface Props {
    onClick: (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => void,
}

export default SettingsButton
