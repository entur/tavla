import React from 'react'
import { ArrowIcon } from '@entur/component-library'

import './styles.scss'

const BackButton = ({ action, className, size }: Props): JSX.Element => {
    return (
        <button className={`back-button ${className}`} onClick={action}>
            <ArrowIcon direction="left" size={size || 'small'} />
        </button>
    )
}

interface Props {
    action: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    className: string
    size?: 'small' | 'medium' | 'large'
}

export default BackButton
