import React from 'react'
import { ArrowIcon } from '@entur/component-library'

import './styles.scss'

const BackButton = ({ action, className }) => {
    return (
        <button className={`back-button ${className}`} onClick={action}>
            <ArrowIcon direction="left" size="small" />
        </button>
    )
}

export default BackButton
