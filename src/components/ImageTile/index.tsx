import React from 'react'

import './style.scss'

interface Props {
    url: string
}

const ImageTile = ({ url }: Props): JSX.Element => (
    <img className="image-tile__image" src={url} alt="Random image" />
)

export default ImageTile
