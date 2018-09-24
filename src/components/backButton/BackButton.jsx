import React from 'react'
import Arrow from '../../assets/icons/arrow.js'
import './styles.scss'

const BackButton = ({ action, className }) => {
    return (
        <button className={`back-button ${className}`} onClick={action}>
            <Arrow className="arrow" height={26} width={26} />
        </button>
    )
}

export default BackButton
