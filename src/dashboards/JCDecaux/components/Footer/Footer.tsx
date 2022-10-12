import React from 'react'
import Images from '../../../../assets/images/app_images.webp'
import './Footer.scss'

const Footer = (): JSX.Element => (
    <div className="footer-wrapper">
        <div className="footer-text">
            <h2 className="footer-heading">Last ned Entur-appen</h2>
            <h3 className="footer-description">
                Her finner du reiseforslag og billetter til kollektiv- transport
                i nesten hele Norge!
            </h3>
        </div>
        <img src={Images} />
    </div>
)

export { Footer }
