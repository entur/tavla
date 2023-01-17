import React from 'react'
import Images from '../../../../assets/images/app_images_cropped.png'
import classes from './PosterFooter.module.scss'

const PosterFooter = (): JSX.Element => (
    <div className={classes.Footer}>
        <div>
            <h2 className={classes.FooterHeading}>Last ned Entur-appen!</h2>
            <h3 className={classes.FooterDescription}>
                Her finner du kollektiv- og mobilitetstilbud i hele Norge.
            </h3>
        </div>
        <img src={Images} className={classes.AppImage} />
    </div>
)

export { PosterFooter }
