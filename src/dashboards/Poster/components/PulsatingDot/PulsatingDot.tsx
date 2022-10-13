import React from 'react'
import './PulsatingDot.scss'

const PulsatingDot = (): JSX.Element => (
    <div className="ring-container">
        <div className="ringring"></div>
        <div className="circle"></div>
    </div>
)

export { PulsatingDot }
