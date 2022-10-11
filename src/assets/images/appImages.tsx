import React from 'react'
import Images from './app_images.webp'

// note: tsx i images mappen, kan brukes direkte no need for component
function AppImages({ height }: Props): JSX.Element {
    const appImages = Images

    return <img src={appImages} height={height} />
}

interface Props {
    height?: string
}

export default AppImages
