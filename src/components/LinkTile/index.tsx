import React from 'react'
import QRCode from 'react-qr-code'

import { colors } from '@entur/tokens'

import './style.scss'

interface Props {
    url: string
}

const LinkTile = ({ url }: Props): JSX.Element => (
    <div className="tile">
        <div className="link-tile">
            <QRCode
                className="qr-code"
                value={url}
                size={256}
                fgColor={colors.brand.blue}
                level="Q"
            ></QRCode>
        </div>
    </div>
)

export default LinkTile
