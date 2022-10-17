import React from 'react'
import QRCode from 'react-qr-code'
import { colors } from '@entur/tokens'
import { Link, Paragraph } from '@entur/typography'
import { CustomTile, Theme } from '../../types'
import { useSettings } from '../../settings/SettingsProvider'
import './QRTile.scss'

const QRTile = ({ sourceUrl, description }: CustomTile): JSX.Element => {
    const [settings] = useSettings()
    const { theme = Theme.DEFAULT } = settings || {}

    return (
        <div className="qr-tile__wrapper">
            <div className="qr-tile__code">
                <QRCode
                    className="qr-code"
                    value={sourceUrl}
                    size={256}
                    fgColor={theme !== Theme.DARK ? colors.brand.blue : 'black'}
                    level="Q"
                ></QRCode>
            </div>
            <Link className="qr-tile__link">{sourceUrl}</Link>
            {description && (
                <Paragraph className="qr-tile__description">
                    {description}
                </Paragraph>
            )}
        </div>
    )
}

export { QRTile }
