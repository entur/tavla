import React, { Fragment, useEffect, useState } from 'react'

import { useRouteMatch } from 'react-router'

import { SubwayIcon } from '@entur/icons'
import { colors } from '@entur/tokens'
import { Paragraph } from '@entur/typography'

import { IconColorType } from '../../../../types'

import './styles.scss'

type Props = {
    fontScale: number
}

const FontSizePreview = ({ fontScale }: Props) => {
    const boardId = useRouteMatch<{ documentId: string }>('/admin/:documentId')
        ?.params?.documentId
    const [baseFontSize, setBaseFontSize] = useState(16)

    useEffect(() => {
        const updatedFontSize = fontScale * 16
        setBaseFontSize(updatedFontSize)
    }, [boardId, fontScale])

    const subLabels = [
        { time: 'Nå' },
        { time: '4 min' },
        { time: '13 min' },
        { time: '10:05' },
        { time: '10:13' },
    ]

    return (
        <div>
            <Paragraph className="introductoryText">
                Forhåndsvisning av tekstørrelsen:
            </Paragraph>
            <div className="tilePreview" style={{ fontSize: baseFontSize }}>
                <div className="tilePreview__tileRow">
                    <div className="tilePreview__icon">
                        <SubwayIcon
                            color={
                                colors.transport[IconColorType.CONTRAST].metro
                            }
                        />
                    </div>
                    <div className="tilePreview__texts">
                        <div className="tilePreview__label">
                            1 Bergkrystallen
                        </div>
                        <div className="tilePreview__platform-info">Spor 1</div>
                        <div className="tilePreview__sublabels">
                            {subLabels.map((subLabel, index) => (
                                <Fragment key={index}>
                                    <div className="tilePreview__sublabel">
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
export default FontSizePreview
