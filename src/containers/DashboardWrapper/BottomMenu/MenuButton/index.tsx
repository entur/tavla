import React from 'react'

import './styles.scss'

import { Tooltip } from '@entur/tooltip'

function MenuButton({ title, icon, callback, tooltip }: Props): JSX.Element {
    const button = (
        <button onClick={callback} className="bottom_menu_button hvr-float">
            <div className="iconHolder">{icon}</div>
            <span className="titleHolder">{title}</span>
        </button>
    )

    if (tooltip) {
        return (
            <Tooltip content={tooltip} placement="top">
                {button}
            </Tooltip>
        )
    }

    return button
}

interface Props {
    title: string
    icon: JSX.Element
    callback?: (event: React.SyntheticEvent<HTMLButtonElement>) => void
    tooltip?: React.ReactNode
}

export default MenuButton
