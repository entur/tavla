import React from 'react'

import './styles.scss'

function PlatformInfo({ platform, type }: Props): JSX.Element {
    return (
        <div className="platform-info">
            {platform !== '' && platform !== undefined
                ? type === 'rail'
                    ? `Spor ${platform}`
                    : `Plattform ${platform}`
                : ''}
        </div>
    )
}

interface Props {
    platform?: string
    type?: string
}

export default PlatformInfo
