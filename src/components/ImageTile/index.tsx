import React from 'react'

import { Heading3, Paragraph } from '@entur/typography'

import { CustomTile } from '../../types'

import './styles.scss'

const ImageTile = ({
    sourceUrl,
    description,
    displayHeader,
}: CustomTile): JSX.Element => (
    <div
        className="image-tile"
        style={{ backgroundImage: `url("${sourceUrl}")` }}
    >
        {(displayHeader || description) && (
            <div className="image-tile__info-box">
                {displayHeader && (
                    <Heading3>{displayHeader.toUpperCase()}</Heading3>
                )}
                {description && <Paragraph>{description}</Paragraph>}
            </div>
        )}
    </div>
)

export default ImageTile
