import React, { Fragment } from 'react'
import { format, isSameDay, isToday, formatISO } from 'date-fns'
import { nb } from 'date-fns/locale'
import { Heading3 } from '@entur/typography'
import { TileSubLabel } from '../../../../types'
import { SubLabelIcon } from '../../../../components/SubLabelIcon/SubLabelIcon'
import { PlatformInfo } from './PlatformInfo/PlatformInfo'
import './TileRow.scss'

interface TileRowProps {
    label: string
    subLabels: TileSubLabel[]
    icon: JSX.Element | null
    hideSituations?: boolean
    hideTracks?: boolean
    platform?: string
    type?: string
}

function TileRow({
    label,
    icon,
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

function Divider() {
    return <div role="separator" className="tilerow__sublabel__divider"></div>
}

function Date({ date }: { date: Date }) {
    const formatedDate = format(date, 'd. MMMM', { locale: nb })

    return <div className="tilerow__sublabel__date">{`(${formatedDate})`}</div>
}

export { TileRow }
