import React from 'react'
import { CustomTile } from 'src/types'
import { Heading3, Paragraph } from '@entur/typography'
import classes from './ImageTile.module.scss'

const ImageTile = ({
    sourceUrl,
    description,
    displayHeader,
}: CustomTile): JSX.Element => (
    <div
        className={classes.ImageTile}
        style={{ backgroundImage: `url("${sourceUrl}")` }}
    >
        {(displayHeader || description) && (
            <div className={classes.InfoBox}>
                {displayHeader && (
                    <Heading3>{displayHeader.toUpperCase()}</Heading3>
                )}
                {description && <Paragraph>{description}</Paragraph>}
            </div>
        )}
    </div>
)

export { ImageTile }
