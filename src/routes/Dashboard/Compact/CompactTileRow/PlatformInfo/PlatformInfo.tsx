import React from 'react'
import classes from './PlatformInfo.module.scss'

function PlatformInfo({
    platform,
    type,
}: {
    platform: string | null
    type?: string
}): JSX.Element | null {
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
