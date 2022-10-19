import React from 'react'
import classNames from 'classnames'
import { ValidationCheck } from '../../../assets/icons/ValidationCheck'
import './RadioBox.scss'

interface RadioBoxProps {
    selected: boolean
    className?: string
}

const RadioBox: React.FC<RadioBoxProps> = ({ selected, className }) => (
    <div
        className={classNames('radio', { radio__checked: selected }, className)}
    >
        {selected ? <ValidationCheck /> : null}
    </div>
)

export { RadioBox }
