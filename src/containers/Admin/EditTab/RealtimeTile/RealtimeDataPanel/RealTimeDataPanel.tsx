import React, { useCallback, useMemo } from 'react'
import { uniq, xor } from 'lodash'
import { FilterChip } from '@entur/chip'
import { Switch, TravelSwitch } from '@entur/form'
import { Heading3, Label, Paragraph } from '@entur/typography'
import { ExpandablePanel } from '@entur/expand'
import { useSettings } from '../../../../../settings/SettingsProvider'
import { isTransport } from '../../../../../utils/typeguards'
import { TransportModeIcon } from '../../../../../components/TransportModeIcon/TransportModeIcon'
import { useRealtimePositionLineRefs } from '../../../../../logic/use-realtime-position-line-refs/useRealtimePositionLineRefs'
import { useUniqueLines } from '../../../../../logic/use-unique-lines/useUniqueLines'
import { TransportMode } from '../../../../../../graphql-generated/journey-planner-v3'
import { byTransportModeName, transportModeName } from './transportModeName'
import { PermanentLinesPanel } from './PermanentLinesPanel'
import './linesPanel.scss'

const RealtimeDataPanel = (): JSX.Element => {
    const [settings, setSettings] = useSettings()

    const { realtimePositionLineRefs } = useRealtimePositionLineRefs()
    const { uniqueLines } = useUniqueLines()

    const realtimeLines = useMemo(
        () =>
            uniqueLines.filter((line) =>
                realtimePositionLineRefs.includes(line.id),
            ),
        [uniqueLines, realtimePositionLineRefs],
    )

    const modes = useMemo(
        () =>
            uniq(realtimeLines.map((line) => line.transportMode)).sort(
                byTransportModeName,
            ),
        [realtimeLines],
    )

    const toggleRealtimeDataLineIds = useCallback(
        (lineId: string) => () => {
            setSettings({
                hiddenRealtimeDataLineRefs: xor(
                    settings.hiddenRealtimeDataLineRefs,
                    [lineId],
                ),
                hideRealtimeData: false,
            })
        },
        [settings.hiddenRealtimeDataLineRefs, setSettings],
    )

    const toggleRealtimeDataLineModes = useCallback(
        (mode: TransportMode) => () => {
            setSettings({
                hiddenRealtimeDataLineRefs: xor(
                    settings.hiddenRealtimeDataLineRefs,
                    realtimeLines
                        .filter((it) => it.transportMode === mode)
                        .map((it) => it.id),
                ),
                hideRealtimeData: false,
            })
        },
        [settings.hiddenRealtimeDataLineRefs, setSettings, realtimeLines],
    )

    if (realtimeLines.length === 0) {
        return (
            <Paragraph>
                Ingen sanntidsdata å vise for stasjonene og modusene som er
                valgt.
            </Paragraph>
        )
    }
    return (
        <div className="realtime-detail-panel">
            <div className="realtime-detail-panel__realtime-selection-panel">
                {modes.map((mode) => (
                    <div className="expandable-panel__wrapper" key={mode}>
                        <ExpandablePanel
                            title={
                                <div className="expandable-panel__title-wrapper">
                                    <span className="expandable-panel__title-name">
                                        {transportModeName(mode)}
                                    </span>
                                    <span onClick={(e) => e.stopPropagation()}>
                                        <TravelSwitch
                                            transport={
                                                isTransport(mode) ? mode : 'bus'
                                            }
                                            size="large"
                                            checked={realtimeLines
                                                .filter(
                                                    ({ transportMode }) =>
                                                        transportMode === mode,
                                                )
                                                .some(
                                                    ({ id }) =>
                                                        !settings.hiddenRealtimeDataLineRefs.includes(
                                                            id,
                                                        ),
                                                )}
                                            onChange={toggleRealtimeDataLineModes(
                                                mode,
                                            )}
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
                                                    onChange={toggleRealtimeDataLineIds(
                                                        id,
                                                    )}
                                                    checked={
                                                        !settings.hiddenRealtimeDataLineRefs.includes(
                                                            id,
                                                        )
                                                    }
                                                >
                                                    {publicCode}
                                                    <TransportModeIcon
                                                        transportMode={
                                                            transportMode
                                                        }
                                                    />
                                                </FilterChip>
                                            </div>
                                        ),
                                    )}
                            </div>
                        </ExpandablePanel>
                    </div>
                ))}
            </div>
            <div className="realtime-detail-panel__route-selection-wrapper">
                <Heading3>Rutelinje</Heading3>
                <Label>
                    Pek på et posisjonsikon for å se ruten i kartet. Trykk på
                    posisjonsikonet for å vise ruten permanent.
                </Label>
                <div className="realtime-detail-panel__route-display-selection">
                    <span className="realtime-detail-panel__route-display-selection-info-text">
                        Vis rutelinjer i kartet
                    </span>
                    <Switch
                        checked={settings.showRoutesInMap}
                        onChange={() => {
                            setSettings({
                                showRoutesInMap: !settings.showRoutesInMap,
                                hideRealtimeData: false,
                            })
                        }}
                    />
                </div>
                {settings.showRoutesInMap && (
                    <PermanentLinesPanel
                        realtimeLines={realtimeLines}
                        hiddenRealtimeDataLineRefs={
                            settings.hiddenRealtimeDataLineRefs
                        }
                        permanentlyVisibleRoutesInMap={
                            settings.permanentlyVisibleRoutesInMap
                        }
                        setSettings={setSettings}
                    />
                )}
            </div>
        </div>
    )
}

export { RealtimeDataPanel }
