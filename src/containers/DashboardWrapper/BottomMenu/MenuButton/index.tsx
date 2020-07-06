import React from 'react'

import './styles.scss'

function MenuButton({ title, icon, callback }: Props): JSX.Element {
    return (
        <button
            onClick={callback}
            className="bottom_menu_button hvr-float hvr-underline-from-center"
        >
            <div className="iconHolder">{icon}</div>
            {title}
        </button>
    )
}

interface Props {
    title: string
    icon: JSX.Element
    callback?: (event: React.SyntheticEvent<HTMLButtonElement>) => void
}

export default MenuButton
