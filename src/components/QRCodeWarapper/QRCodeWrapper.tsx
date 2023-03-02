import React from 'react'
import classNames from 'classnames'
import QrCodeApp from 'assets/images/qr_code_entur_app.svg'
import classes from './QRCodeWrapper.module.scss'

function QRCodeWrapper({ className }: { className?: string }) {
    return (
        <div className={classNames(classes.Wrapper, className)}>
            <img src={QrCodeApp} height={250} className={className} />
        </div>
    )
}

export { QRCodeWrapper }
