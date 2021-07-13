import React from 'react'

import './styles.scss'

function PlatformInfo({ platform, type }: Props): JSX.Element | null {
    return platform && type ? (
        <div className="platform-info">
            {type === 'rail' ? `Spor ${platform}` : `Plattform ${platform}`}
        </div>
    ) : null
}

interface Props {
    platform?: string
    type?: string
}

export default PlatformInfo
