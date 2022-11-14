import React, { Fragment } from 'react'
import { format, isSameDay, isToday, formatISO } from 'date-fns'
import { nb } from 'date-fns/locale'
import { Heading3 } from '@entur/typography'
import { TileSubLabel } from '../../../types'
import { SubLabelIcon } from '../../../components/SubLabelIcon/SubLabelIcon'
import { PlatformInfo } from './PlatformInfo/PlatformInfo'
import classes from './TileRow.module.scss'

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
        <div className={classes.Tilerow}>
            <div className={classes.Icon}>{icon}</div>
            <div className={classes.Texts}>
                <Heading3 className={classes.Label}>{label}</Heading3>
                {!hideTracks && (
                    <PlatformInfo platform={platform} type={type} />
                )}
                <div className={classes.Sublabels}>
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
                                <div className={classes.Sublabel}>
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
    return <div role="separator" className={classes.Divider} />
}

function Date({ date }: { date: Date }) {
    const formatedDate = format(date, 'd. MMMM', { locale: nb })

    return <div className={classes.Date}>{`(${formatedDate})`}</div>
}

export { TileRow }
