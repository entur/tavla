import React from 'react'
import Images from '../../../../assets/images/app_images_cropped.png'
import './PosterFooter.scss'

const PosterFooter = (): JSX.Element => (
    <div className="poster-footer">
        <div>
            <h2 className="poster-footer-heading">Last ned Entur-appen!</h2>
            <h3 className="poster-footer-description">
                Her finner du kollektiv- og mobilitetstilbud i hele Norge.
            </h3>
        </div>
        <img src={Images} className="poster-footer-app-image" />
    </div>
)

export { PosterFooter }
