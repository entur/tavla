import React from 'react'

import { BackArrowIcon } from '@entur/icons'

import './styles.scss'

const BackButton = ({ action, className }: Props): JSX.Element => (
    <button className={`back-button ${className}`} onClick={action}>
        <BackArrowIcon />
    </button>
)

interface Props {
    action: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    className: string
}

export default BackButton
