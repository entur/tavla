import React from 'react'
import { ArrowIcon } from '@entur/component-library'

import './styles.scss'

const BackButton = ({ action, className }: Props): JSX.Element => {
    return (
        <button className={`back-button ${className}`} onClick={action}>
            <ArrowIcon direction="left" size="small" />
        </button>
    )
}

interface Props {
    action: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
    className: string,
}

export default BackButton
