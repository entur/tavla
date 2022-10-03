import React from 'react'

import Images from './app_images.webp'

function AppImages({ height }: Props): JSX.Element {
    const appImages = Images

    return <img src={appImages} height={height} />
}

interface Props {
    height?: string
}

export default AppImages
