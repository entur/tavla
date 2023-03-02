import React from 'react'
import classNames from 'classnames'
import { QrNew } from 'assets/icons/QrNew'
import classes from './QRCodeWrapper.module.scss'

function QRCodeWrapper({ className }: { className?: string }) {
    return (
        <div className={classNames(classes.Wrapper, className)}>
            <QrNew />
        </div>
    )
}

export { QRCodeWrapper }
