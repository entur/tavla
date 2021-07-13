import React from 'react'
import { Heading3 } from '@entur/typography'

import { TileSubLabel } from '../../../../types'
import ValidationExclamation from '../../../../assets/icons/ValidationExclamation'
import ValidationError from '../../../../assets/icons/ValidationError'
import './styles.scss'
import SituationModal from '../../../../components/SituationModal'

function isMobileWeb(): boolean {
    return (
        typeof window.orientation !== 'undefined' ||
        navigator.userAgent.indexOf('IEMobile') !== -1
    )
}

export function TileRow({
    label,
    icon,
    subLabels,
    hideSituations,
}: Props): JSX.Element {
    return (
        <div className="tilerow">
            <div className="tilerow__icon">{icon}</div>
            <div className="tilerow__texts">
                <Heading3 className="tilerow__label">{label}</Heading3>
                <div className="tilerow__sublabels">
                    {subLabels.map((subLabel, index) => (
                        <div className="tilerow__sublabel" key={index}>
                            {subLabel.time}
                            <SubLabelIcon
                                hideSituations={hideSituations}
                                subLabel={subLabel}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function SubLabelIcon({
    subLabel,
    hideSituations,
}: {
    subLabel: TileSubLabel
    hideSituations?: boolean
}): JSX.Element | null {
    if (subLabel.hasCancellation)
        return (
            <div className="tilerow__sublabel__cancellation">
                <ValidationError />
            </div>
        )

    if (
        subLabel.hasSituation &&
        !hideSituations &&
        isMobileWeb() &&
        subLabel?.situation
    )
        return (
            <div className="tilerow__sublabel__situation">
                <SituationModal situationMessage={subLabel.situation} />
            </div>
        )
    else if (subLabel.hasSituation && !hideSituations)
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
    hideSituations?: boolean
}

export default TileRow
