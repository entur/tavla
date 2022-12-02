import React from 'react'
import { CloseIcon } from '@entur/icons'
import classes from './CloseButton.module.scss'

interface CloseButtonProps {
    onClick: () => void
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClick }) => (
    <button className={classes.CloseButton} onClick={onClick}>
        <CloseIcon className={classes.Icon} />
        Lukk
    </button>
)

export { CloseButton }
