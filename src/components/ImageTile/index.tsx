import React from 'react'

import { Heading3, Paragraph } from '@entur/typography'

import { CustomImageTile } from '../../types'

import './styles.scss'

const ImageTile = ({
    linkAddress,
    description,
    displayHeader,
}: CustomImageTile): JSX.Element => (
    <div
        className="image-tile"
        style={{ backgroundImage: `url("${linkAddress}")` }}
    >
        <div className="image-tile__info-box">
            <Heading3>{displayHeader.toUpperCase()}</Heading3>
            {description && <Paragraph>{description}</Paragraph>}
        </div>
    </div>
)

export default ImageTile
