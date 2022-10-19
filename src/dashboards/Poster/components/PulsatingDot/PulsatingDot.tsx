import React from 'react'
import './PulsatingDot.scss'

const PulsatingDot = (): JSX.Element => (
    <div className="pulsating-dot">
        <div className="pulsating-dot-outer-circle"></div>
        <div className="pulsating-dot-inner-circle"></div>
    </div>
)

export { PulsatingDot }
