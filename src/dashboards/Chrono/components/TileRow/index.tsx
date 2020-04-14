import React from 'react'
import { Heading3 } from '@entur/typography'
import { ValidationExclamationIcon, ValidationErrorIcon } from '@entur/icons'
import { colors } from '@entur/tokens'

import { TileSubLabel } from '../../../../types'
import './styles.scss'

export function TileRow({ label, icon, subLabel }: Props): JSX.Element {
    return (
        <div className="tilerow">
            <div className="tilerow__icon">{icon}</div>
            <Heading3 className="tilerow__label">{label}</Heading3>
            <div className="tilerow__sublabel">
                {subLabel.time}
                <SubLabelIcon subLabel={subLabel} />
            </div>
        </div>
    )
}

function SubLabelIcon({ subLabel }: { subLabel: TileSubLabel }): JSX.Element {
    if (subLabel.hasCancellation)
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
    subLabel: TileSubLabel
    icon: JSX.Element
}

export default TileRow
