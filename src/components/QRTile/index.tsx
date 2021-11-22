import React from 'react'
import QRCode from 'react-qr-code'

import { colors } from '@entur/tokens'
import { Link, Paragraph } from '@entur/typography'

import { CustomQRTile, Theme } from '../../types'
import { useSettingsContext } from '../../settings'

import './styles.scss'

const QRTile = ({ linkAddress, description }: CustomQRTile): JSX.Element => {
    const [settings] = useSettingsContext()
    const { theme = Theme.DEFAULT } = settings || {}

    return (
        <div className="qr-tile__wrapper">
            <div className="qr-tile__code">
                <QRCode
                    className="qr-code"
                    value={linkAddress}
                    size={256}
                    fgColor={theme !== Theme.DARK ? colors.brand.blue : 'black'}
                    level="Q"
                ></QRCode>
            </div>
            <Link className="qr-tile__link">{linkAddress}</Link>
            {description && (
                <Paragraph className="qr-tile__description">
                    {description}
                </Paragraph>
            )}
        </div>
    )
}

export default QRTile
