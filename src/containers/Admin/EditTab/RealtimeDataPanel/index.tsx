import React, { useMemo, useState } from 'react'

import { FilterChip } from '@entur/chip'
import { Switch, TravelSwitch } from '@entur/form'
import { Loader } from '@entur/loader'
import { Heading3, Label, Paragraph } from '@entur/typography'
import { ExpandablePanel } from '@entur/expand'

import { Line } from '../../../../types'
import {
    getIcon,
    isTransport,
    transportModeNameMapper,
} from '../../../../utils'

import './styles.scss'
import { ClosedLockIcon } from '@entur/icons'
import { divide } from 'lodash'

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
    const [showRoutesInMap, setShowRoutesInMap] = useState(false)

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
        <div className="realtime-detail-panel">
            <div className="realtime-detail-panel__realtime-selection-panel">
                {modes.map((mode) => (
                    <div className="expandable-panel__wrapper" key={mode}>
                        <ExpandablePanel
                            title={
                                <div className="expandable-panel__title-wrapper">
                                    <span className="expandable-panel__title-name">
                                        {transportModeNameMapper(mode)}
                                    </span>
                                    <span onClick={(e) => e.stopPropagation()}>
                                        <TravelSwitch
                                            transport={
                                                isTransport(mode) ? mode : 'bus'
                                            }
                                            size="large"
                                        />
                                    </span>
                                </div>
                            }
                        >
                            <div className="realtime-detail-panel__container">
                                {realtimeLines
                                    .filter(
                                        (line) => line.transportMode === mode,
                                    )
                                    .map(
                                        ({ id, publicCode, transportMode }) => (
                                            <div
                                                className="realtime-detail-panel__buttons"
                                                key={id}
                                            >
                                                <FilterChip
                                                    value={id}
                                                    onChange={() =>
                                                        toggleRealtimeDataLineIds(
                                                            id,
                                                        )
                                                    }
                                                    checked={
                                                        !hiddenLines.includes(
                                                            id,
                                                        )
                                                    }
                                                >
                                                    {publicCode}
                                                    {getIcon(transportMode)}
                                                </FilterChip>
                                            </div>
                                        ),
                                    )}
                            </div>
                        </ExpandablePanel>
                    </div>
                ))}
            </div>
            <div className="rutelinje-wrapper">
                <Heading3>Rutelinje</Heading3>
                <Label>
                    Pek på et posisjonsikon for å se ruten i kartet. Trykk på
                    posisjonsikonet for å vise ruten permanent
                </Label>
                <div className="show-rutelinje">
                    <span className="show-rutelinje-info-text">
                        Vis rutelinjer i kartet
                    </span>
                    <Switch
                        checked={showRoutesInMap}
                        onChange={() => setShowRoutesInMap((prev) => !prev)}
                    ></Switch>
                </div>
                {showRoutesInMap && (
                    <div className="expandable-panel__wrapper">
                        <ExpandablePanel
                            title={
                                <div className="expandable-panel__title-wrapper">
                                    <span className="icon-wrapper">
                                        <ClosedLockIcon></ClosedLockIcon>
                                    </span>
                                    <span>Permanente rutelinjer</span>
                                </div>
                            }
                            defaultOpen={true}
                        >
                            something
                        </ExpandablePanel>
                    </div>
                )}
            </div>
        </div>
    ) : (
        <Paragraph>
            Ingen sanntidsdata å vise for stasjoenene og modusene som er valgt.
        </Paragraph>
    )
}

export default RealtimeDataPanel
