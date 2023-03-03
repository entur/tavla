import React from 'react'
import QRCode from 'react-qr-code'
import classNames from 'classnames'
import { Tile } from 'components/Tile'
import { useSettings } from 'settings/SettingsProvider'
import { Heading2, Paragraph } from '@entur/typography'
import { colors } from '@entur/tokens'
import classes from './CustomQRTile.module.scss'

function CustomQRTile({
    title,
    sourceUrl,
    description,
    size,
}: {
    title: string
    sourceUrl: string
    description?: string
    size?: number
}) {
    const [settings] = useSettings()

    return (
        <Tile className={classNames(classes.Tile)}>
            <Heading2 className={classes.Title}>{title}</Heading2>
            <div className={classes.Wrapper}>
                <div className={classes.Code}>
                    <QRCode
                        value={sourceUrl}
                        size={size}
                        fgColor={
                            settings.theme !== 'dark'
                                ? colors.brand.blue
                                : 'black'
                        }
                        level="L"
                    />
                </div>
                {description && (
                    <Paragraph className={classes.Description}>
                        {description}
                    </Paragraph>
                )}
            </div>
        </Tile>
    )
}

export { CustomQRTile }
