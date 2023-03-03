import React from 'react'
import QRCode from 'react-qr-code'
import { useSettings } from 'settings/SettingsProvider'
import { Paragraph } from '@entur/typography'
import { colors } from '@entur/tokens'
import classes from './CustomQRTile.module.scss'

function CustomQRTile({
    sourceUrl,
    description,
    size,
}: {
    sourceUrl: string
    description?: string
    size?: number
}) {
    const [settings] = useSettings()

    return (
        <>
            <div className={classes.Code}>
                <QRCode
                    value={sourceUrl}
                    size={size}
                    fgColor={
                        settings.theme !== 'dark' ? colors.brand.blue : 'black'
                    }
                    level="L"
                />
            </div>
            {description && (
                <Paragraph className={classes.Description}>
                    {description}
                </Paragraph>
            )}
        </>
    )
}

export { CustomQRTile }
