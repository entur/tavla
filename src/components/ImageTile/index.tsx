import React from 'react'
import { CustomImageTile } from '../../types'

import './style.scss'

const ImageTile = ({
    linkAddress,
    description,
    displayHeader,
}: CustomImageTile): JSX.Element => (
    <img
        className="image-tile__image"
        src={linkAddress}
        alt="Random image"
        draggable={false}
    />
)

export default ImageTile
