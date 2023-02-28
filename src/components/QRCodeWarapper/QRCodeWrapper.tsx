import React from 'react'
import QRCode from 'react-qr-code'
import classNames from 'classnames'
import { useSettings } from 'settings/SettingsProvider'
import { colors } from '@entur/tokens'
import { Paragraph } from '@entur/typography'
import classes from './QRCodeWrapper.module.scss'

function QRCodeWrapper({
    className,
    sourceUrl,
    description,
    size,
}: {
    className?: string
    sourceUrl: string
    description?: string
    size?: number
}) {
    const [settings] = useSettings()

    return (
        <div className={classNames(classes.Wrapper, className)}>
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
        </div>
    )
}

export { QRCodeWrapper }
