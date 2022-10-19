import React from 'react'
import { CloseIcon } from '@entur/icons'
import './CloseButton.scss'

interface CloseButtonProps {
    onClick: () => void
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClick }) => (
    <button className="close-button" onClick={onClick}>
        <CloseIcon className="icon" />
        Lukk
    </button>
)

export { CloseButton }
