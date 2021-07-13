import React from 'react'

import { Heading3 } from '@entur/typography'

import ValidationExclamation from '../../../../assets/icons/ValidationExclamation'
import ValidationError from '../../../../assets/icons/ValidationError'
import { TileSubLabel } from '../../../../types'

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
    subLabel,
    hideSituations,
}: Props): JSX.Element {
    return (
        <div className="tilerow">
            <div className="tilerow__icon">{icon}</div>
            <Heading3 className="tilerow__label">{label}</Heading3>
            <div className="tilerow__sublabel">
                {subLabel.time}
                <SubLabelIcon
                    hideSituations={hideSituations}
                    subLabel={subLabel}
                />
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
    if (!hideSituations && subLabel?.situation)
        if (isMobileWeb())
            return (
                <div className="tilerow__sublabel__situation">
                    <SituationModal situationMessage={subLabel.situation} />
                </div>
            )
        else
            return (
                <div className="tilerow__sublabel__situation">
                    <ValidationExclamation />
                </div>
            )

    if (subLabel.hasCancellation)
        return (
            <div className="tilerow__sublabel__cancellation">
                <ValidationError />
            </div>
        )
    return null
}

interface Props {
    label: string
    subLabel: TileSubLabel
    icon: JSX.Element | null
    hideSituations?: boolean
}

export default TileRow
