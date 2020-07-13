import React from 'react'

import { CheckIcon } from '@entur/icons'
import { colors } from '@entur/tokens'

import './styles.scss'

interface RadioBoxProps {
    selected: boolean
    className?: string
}

export function RadioBox({ selected, className }: RadioBoxProps): JSX.Element {
    return (
        <div
            className={`radio checkmark ${
                selected ? 'checked' : ''
            } ${className}`}
        >
            {selected ? (
                <CheckIcon className="icon" color={colors.brand.blue} />
            ) : null}
        </div>
    )
}
