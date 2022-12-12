import React from 'react'
import { Tooltip } from '@entur/tooltip'
import classes from './MenuButton.module.scss'

function MenuButton({ title, icon, callback, tooltip }: Props): JSX.Element {
    const btn = (
        <button onClick={callback} className={classes.MenuButton}>
            <div>{icon}</div>
            <span>{title}</span>
        </button>
    )

    if (tooltip) {
        return (
            <Tooltip content={tooltip} placement="top">
                {btn}
            </Tooltip>
        )
    }

    return btn
}

interface Props {
    title: string
    icon: JSX.Element
    callback?: (event: React.MouseEvent<HTMLButtonElement>) => void
    tooltip?: React.ReactNode
}

export { MenuButton }
