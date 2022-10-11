import React from 'react'
import AppImages from '../../../assets/images/appImages'
import './Footer.scss'

const Footer = (): JSX.Element | null => (
    <div className="footer-wrapper">
        <div className="footer-text">
            <h2 className="footer-heading">Last ned Entur-appen</h2>
            <h3 className="footer-description">
                Her finner du reiseforslag og billetter til kollektiv- transport
                i nesten hele Norge!
            </h3>
        </div>
        <AppImages />
    </div>
)

export { Footer }
