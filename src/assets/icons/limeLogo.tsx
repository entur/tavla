import React from 'react'

import Lime from './../logos/lime-24.svg'

function LimeLogo({ className, height }: Props): JSX.Element {
    return <img src={Lime} height={height} className={className} />
}

interface Props {
    className?: string
    height?: string
}

export default LimeLogo
