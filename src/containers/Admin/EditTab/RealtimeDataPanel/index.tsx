import React, { useMemo } from 'react'

import { FilterChip } from '@entur/chip'
import { Fieldset, TravelSwitch } from '@entur/form'
import { Loader } from '@entur/loader'
import { Paragraph } from '@entur/typography'
import { ExpandablePanel } from '@entur/expand'

import { Line } from '../../../../types'
import {
    getIcon,
    isTransport,
    transportModeNameMapper,
} from '../../../../utils'

import './styles.scss'

interface Props {
    realtimeLines: Line[] | undefined
    toggleRealtimeDataLineIds: (lineId: string) => void
    hiddenLines: string[]
}

const RealtimeDataPanel = ({
    realtimeLines,
    toggleRealtimeDataLineIds,
    hiddenLines,
}: Props): JSX.Element => {
    const modes = useMemo(
        () =>
            [...new Set(realtimeLines?.map((line) => line.transportMode))].sort(
                (a, b) =>
                    transportModeNameMapper(a) > transportModeNameMapper(b)
                        ? 1
                        : -1,
            ),
        [realtimeLines],
    )

    return !realtimeLines ? (
        <Loader>Laster...</Loader>
    ) : realtimeLines.length > 0 ? (
        <div className="realtime-detail-panel ">
            {modes.map((mode) => (
                <ExpandablePanel
                    key={mode}
                    title={
                        <div className="expandable-panel__title-wrapper">
                            <span className="expandable-panel__title-name">
                                {transportModeNameMapper(mode)}
                            </span>
                            <TravelSwitch
                                transport={isTransport(mode) ? mode : 'bus'}
                                size="large"
                            />
                        </div>
                    }
                >
                    <div className="realtime-detail-panel__container">
                        {realtimeLines
                            .filter((line) => line.transportMode === mode)
                            .map(({ id, publicCode, transportMode }) => (
                                <div
                                    className="realtime-detail-panel__buttons"
                                    key={id}
                                >
                                    <FilterChip
                                        value={id}
                                        onChange={() =>
                                            toggleRealtimeDataLineIds(id)
                                        }
                                        checked={!hiddenLines.includes(id)}
                                    >
                                        {publicCode}
                                        {getIcon(transportMode)}
                                    </FilterChip>
                                </div>
                            ))}
                    </div>
                </ExpandablePanel>
            ))}
        </div>
    ) : (
        <Paragraph>
            Ingen sanntidsdata å vise for stasjoenene og modusene som er valgt.
        </Paragraph>
    )
}

export default RealtimeDataPanel
