import React from 'react'
import classes from './PlatformInfo.module.scss'

interface Props {
    platform: string | null
    type?: string
}

function PlatformInfo({ platform, type }: Props): JSX.Element | null {
    if (!platform || !type) {
        return null
    }

    return (
        <div className={classes.PlatformInfo}>
            {type === 'rail' ? `Spor ${platform}` : `Plattform ${platform}`}
        </div>
    )
}

export { PlatformInfo }
