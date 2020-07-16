import React from 'react'

import ValidationCheck from '../../../assets/icons/ValidationCheck'

import './styles.scss'

interface Props {
    selected: boolean
    className?: string
}

export function RadioBox({ selected, className }: Props): JSX.Element {
    return (
        <div
            className={`radio ${selected ? 'radio__checked' : ''} ${className}`}
        >
            {selected ? <ValidationCheck /> : null}
        </div>
    )
}
