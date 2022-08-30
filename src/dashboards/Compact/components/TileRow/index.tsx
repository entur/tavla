import React, { Fragment } from 'react'

import { format, isSameDay, isToday, formatISO } from 'date-fns'

import { nb } from 'date-fns/locale'

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
}: TileRowProps): JSX.Element {
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
                    {subLabels.map((subLabel, index) => {
                        const nextLabel: TileSubLabel | undefined =
                            subLabels[index + 1]

                        const isLastDepartureOfDay =
                            nextLabel &&
                            !isSameDay(
                                nextLabel.departureTime,
                                subLabel.departureTime,
                            )

                        const showDate =
                            index === 0 && !isToday(subLabel.departureTime)

                        const isoDate = formatISO(subLabel.departureTime)

                        return (
                            <Fragment key={index}>
                                <div className="tilerow__sublabel">
                                    <time dateTime={isoDate}>
                                        {subLabel.time}
                                    </time>

                                    <SubLabelIcon
                                        hideSituations={hideSituations}
                                        subLabel={subLabel}
                                    />

                                    {showDate && (
                                        <Date date={subLabel.departureTime} />
                                    )}
                                </div>
                                {isLastDepartureOfDay && <Divider />}
                            </Fragment>
                        )
                    })}
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

function Divider() {
    return <div role="separator" className="tilerow__sublabel__divider"></div>
}

function Date({ date }: { date: Date }) {
    const formatedDate = format(date, 'd. MMMM', { locale: nb })

    return <div className="tilerow__sublabel__date">{`(${formatedDate})`}</div>
}

interface TileRowProps {
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
