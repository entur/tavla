import React from 'react'
import PropTypes from 'prop-types'

import { SettingsIcon } from '@entur/component-library'

import './styles.scss'

function SettingsButton({ onClick }) {
    return (
        <button className="settings-button" onClick={onClick}>
            <SettingsIcon size="small" />
        </button>
    )
}

SettingsButton.propTypes = {
    onClick: PropTypes.func.isRequired,
}

export default SettingsButton
