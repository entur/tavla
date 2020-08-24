import React from 'react'
import { Heading3 } from '@entur/typography'

import { TileSubLabel } from '../../../../types'
import ValidationExclamation from '../../../../assets/icons/ValidationExclamation'
import ValidationError from '../../../../assets/icons/ValidationError'
import './styles.scss'

export function TileRow({ label, icon, subLabels }: Props): JSX.Element {
    console.log(label, icon, subLabels)

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

function SubLabelIcon({
    subLabel,
}: {
    subLabel: TileSubLabel
}): JSX.Element | null {
    if (subLabel.hasCancellation)
        return (
            <div className="tilerow__sublabel__cancellation">
                <ValidationError />
            </div>
        )

    if (subLabel.hasSituation)
        return (
            <div className="tilerow__sublabel__situation">
                <ValidationExclamation />
            </div>
        )

    return null
}

interface Props {
    label: string
    subLabels: TileSubLabel[]
    icon: JSX.Element | null
}

export default TileRow
