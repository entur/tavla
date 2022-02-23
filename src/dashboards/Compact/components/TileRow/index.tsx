import React from 'react'

import { Heading3 } from '@entur/typography'

import { TileSubLabel } from '../../../../types'
import ValidationExclamation from '../../../../assets/icons/ValidationExclamation'
import ValidationError from '../../../../assets/icons/ValidationError'

import SituationModal from '../../../../components/SituationModal'

import { isMobileWeb } from '../../../../utils'
import { WalkInfo } from '../../../../logic/useWalkInfo'

import PlatformInfo from './PlatformInfo'
import './styles.scss'

const isMobile = isMobileWeb()

function formatWalkInfo(walkInfo: WalkInfo) {
    if (walkInfo.walkTime / 60 < 1) {
        return `Mindre enn 1 min å gå (${Math.ceil(walkInfo.walkDistance)} m)`
    } else {
        return `${Math.ceil(walkInfo.walkTime / 60)} min å gå (${Math.ceil(
            walkInfo.walkDistance,
        )} m)`
    }
}

export function TileRow({
    label,
    icon,
    walkInfo,
    subLabels,
    hideSituations,
    hideTracks,
    platform,
    type,
}: Props): JSX.Element {
    return (
        <div className="tilerow">
            <div className="tilerow__icon">{icon}</div>
            <div className="tilerow__texts">
                <Heading3 className="tilerow__label">{label}</Heading3>
                {!hideTracks && (
                    <PlatformInfo platform={platform} type={type} />
                )}
                {walkInfo ? (
                    <div className="tilerow__walking-time">
                        {formatWalkInfo(walkInfo)}
                    </div>
                ) : null}
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
    if (!hideSituations && subLabel?.situation)
        if (isMobile)
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
    subLabels: TileSubLabel[]
    icon: JSX.Element | null
    walkInfo?: WalkInfo
    hideSituations?: boolean
    hideTracks?: boolean
    platform?: string
    type?: string
}

export default TileRow
