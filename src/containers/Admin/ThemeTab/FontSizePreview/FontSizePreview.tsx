import React, { Fragment } from 'react'
import { SubwayIcon } from '@entur/icons'
import { colors } from '@entur/tokens'
import { Paragraph } from '@entur/typography'
import { IconColorType } from '../../../../types'
import classes from './FontSizePreview.module.scss'

type Props = {
    fontScale: number
}

const BASE_FONT_SIZE = 16

const FontSizePreview: React.FC<Props> = ({ fontScale }) => {
    const subLabels = [
        { time: 'Nå' },
        { time: '4 min' },
        { time: '13 min' },
        { time: '10:05' },
        { time: '10:13' },
    ]

    return (
        <div>
            <Paragraph className={classes.IntroductoryText}>
                Forhåndsvisning av tekstørrelsen:
            </Paragraph>
            <div
                className={classes.FontSizePreview}
                style={{ fontSize: fontScale * BASE_FONT_SIZE }}
            >
                <div className={classes.TileRow}>
                    <div className={classes.Icon}>
                        <SubwayIcon
                            color={
                                colors.transport[IconColorType.CONTRAST].metro
                            }
                        />
                    </div>
                    <div className={classes.Texts}>
                        <div className={classes.Label}>1 Bergkrystallen</div>
                        <div className={classes.PlatformInfo}>Spor 1</div>
                        <div className={classes.Sublabels}>
                            {subLabels.map((subLabel) => (
                                <Fragment key={subLabel.time}>
                                    <div className={classes.Sublabel}>
                                        {subLabel.time}
                                    </div>
                                </Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export { FontSizePreview }
