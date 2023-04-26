import React from 'react'
import { CloseIcon } from '@entur/icons'
import classes from './CloseButton.module.scss'

function CloseButton({ onClick }: { onClick: () => void }) {
    return (
        <button className={classes.CloseButton} onClick={onClick}>
            <CloseIcon className={classes.Icon} />
            Lukk
        </button>
    )
}

export { CloseButton }
