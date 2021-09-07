import React from 'react'
import './styles.scss'

export const SunIconAnimated = (): JSX.Element => (
    <div className="icon">
        <div className="sun">
            <div className="rays"></div>
        </div>
    </div>
)

export const RainIconAnimated = (): JSX.Element => (
    <div className="icon">
        <div className="cloud"></div>
        <div className="rain"></div>
    </div>
)

export const ThunderIconAnimated = (): JSX.Element => (
    <div className="icon thunder-storm">
        <div className="cloud"></div>
        <div className="lightning">
            <div className="bolt"></div>
            <div className="bolt"></div>
        </div>
    </div>
)

export const PartlyCloudyIconAnimated = (): JSX.Element => (
    <div className="icon">
        <div className="cloud cloud_sun"></div>
        <div className="sun">
            <div className="rays"></div>
        </div>
    </div>
)
