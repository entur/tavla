import React from 'react'
import { ValidationCheck } from '../../../assets/icons/ValidationCheck'
import './RadioBox.scss'

interface Props {
    selected: boolean
    className?: string
}

function RadioBox({ selected, className }: Props): JSX.Element {
    return (
        <div
            className={`radio ${selected ? 'radio__checked' : ''} ${className}`}
        >
            {selected ? <ValidationCheck /> : null}
        </div>
    )
}

export { RadioBox }
