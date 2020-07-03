import React from 'react'

import './styles.scss'

function MenuButton({ title, icon, callback }: Props): JSX.Element {
    return (
        <div
            onClick={callback}
            className="bottom_menu_button hvr-float hvr-underline-from-center"
        >
            <div className="iconHolder">{icon}</div>
            <a>{title}</a>
        </div>
    )
}

interface Props {
    title: string
    icon: JSX.Element
    callback?: any
}

export default MenuButton
