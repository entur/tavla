import React from 'react'
import { Heading3 } from '@entur/typography'
import { ValidationExclamationIcon, ValidationErrorIcon } from '@entur/icons'
import { colors } from '@entur/tokens'

import { TileSubLabel } from '../../../../types'
import './styles.scss'

export function TileRow({ label, icon, subLabels }: Props): JSX.Element {
    return (
        <div className="tilerow">
            <div className="tilerow__icon">{icon}</div>
            <div className="tilerow__texts">
                <Heading3 className="tilerow__label">{label}</Heading3>
                <div className="tilerow__sublabels">
                    {subLabels.map((subLabel, index) => (
                        <div className="tilerow__sublabel" key={index}>
                            {subLabel.time}
                            <SubLabelIcon subLabel={subLabel} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function SubLabelIcon({ subLabel }: { subLabel: TileSubLabel }): JSX.Element {
    if (true)
        return (
            <div className="tilerow__sublabel__cancellation">
                <ValidationErrorIcon color={colors.validation.lava} />
            </div>
        )

    if (subLabel.hasSituation)
        return (
            <div className="tilerow__sublabel__situation">
                <ValidationExclamationIcon color={colors.validation.canary} />
            </div>
        )

    return null
}

interface Props {
    label: string
    subLabels: Array<TileSubLabel>
    icon: JSX.Element
}

export default TileRow
