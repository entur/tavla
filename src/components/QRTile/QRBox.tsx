import React from 'react'
import QRCode from 'react-qr-code'
import { colors } from '@entur/tokens'
import { Paragraph } from '@entur/typography'
import { CustomTile, Theme } from '../../types'
import { useSettings } from '../../settings/SettingsProvider'
import './QRBox.scss'

const QRBox = ({ sourceUrl, description }: CustomTile): JSX.Element => {
    const [settings] = useSettings()

    return (
        <div className="qr-box__wrapper">
            <div className="qr-box__code">
                <QRCode
                    className="qr-code"
                    value={sourceUrl}
                    size={80}
                    fgColor={
                        settings.theme !== Theme.DARK
                            ? colors.brand.blue
                            : 'black'
                    }
                    level="L"
                ></QRCode>
            </div>
            {/* <Link className="qr-tile__link">{sourceUrl}</Link> */}
            {description && (
                <Paragraph className="qr-box__description">
                    {description}
                </Paragraph>
            )}
        </div>
    )
}

export { QRBox }
