import React from 'react'

import { CheckIcon } from '@entur/icons'
import { colors } from '@entur/tokens'

import './styles.scss'

interface Props {
    selected: boolean
    className?: string
}

export function RadioBox({ selected, className }: Props): JSX.Element {
    return (
        <div
            className={`radio checkmark ${
                selected ? 'radio__checked' : ''
            } ${className}`}
        >
            {selected ? (
                <CheckIcon className="radio__icon" color={colors.brand.blue} />
            ) : null}
        </div>
    )
}
