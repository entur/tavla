import React, { Fragment } from 'react'
import { format, isSameDay, isToday, formatISO } from 'date-fns'
import { nb } from 'date-fns/locale'
import { Heading3 } from '@entur/typography'
import { TileSubLabel } from '../../../types'
import { SubLabelIcon } from '../../../components/SubLabelIcon/SubLabelIcon'
import { PlatformInfo } from './PlatformInfo/PlatformInfo'
import classes from './CompactTileRow.module.scss'

interface CompactTileRowProps {
    label: string
    subLabels: TileSubLabel[]
    icon: JSX.Element | null
    hideSituations?: boolean
    hideTracks?: boolean
    platform: string | null
    type?: string
}

function CompactTileRow({
    label,
    icon,
    subLabels,
    hideSituations,
    hideTracks,
    platform,
    type,
}: CompactTileRowProps): JSX.Element {
    return (
        <div className={classes.CompactTileRow}>
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
                                nextLabel.expectedDepartureTime,
                                subLabel.expectedDepartureTime,
                            )

                        const showDate =
                            index === 0 &&
                            !isToday(subLabel.expectedDepartureTime)

                        const isoDate = formatISO(
                            subLabel.expectedDepartureTime,
                        )

                        return (
                            <Fragment key={index}>
                                <div className={classes.Sublabel}>
                                    <time dateTime={isoDate}>
                                        {subLabel.displayTime}
                                    </time>

                                    <SubLabelIcon
                                        hideSituations={hideSituations}
                                        subLabel={subLabel}
                                    />

                                    {showDate && (
                                        <Date
                                            date={
                                                subLabel.expectedDepartureTime
                                            }
                                        />
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

export { CompactTileRow }
