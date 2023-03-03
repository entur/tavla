import React from 'react'
import { Tile } from 'components/Tile'
import { Heading2, Paragraph } from '@entur/typography'
import classes from './QRWrapper.module.scss'

function QRWrapper({
    children,
    title,
    description,
}: {
    children: React.ReactNode
    title: string
    description?: string
}) {
    return (
        <Tile className={classes.Tile}>
            <Heading2 className={classes.Title}>{title}</Heading2>
            <div className={classes.Wrapper}>{children}</div>
            {description && (
                <Paragraph className={classes.Description}>
                    {description}
                </Paragraph>
            )}
        </Tile>
    )
}
export { QRWrapper }
