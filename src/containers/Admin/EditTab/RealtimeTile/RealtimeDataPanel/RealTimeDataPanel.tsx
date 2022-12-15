import React, { useMemo } from 'react'
import { uniq } from 'lodash'
import { Switch } from '@entur/form'
import { Heading3, Label, Paragraph } from '@entur/typography'
import { useSettings } from '../../../../../settings/SettingsProvider'
import { useRealtimePositionLineRefs } from '../../../../../logic/use-realtime-position-line-refs/useRealtimePositionLineRefs'
import { useUniqueLines } from '../../../../../logic/use-unique-lines/useUniqueLines'
import { byTransportModeName } from './transportModeName'
import { PermanentLinesPanel } from './PermanentLinesPanel'
import { RealtimeTransportModePanel } from './RealtimeTransportModePanel'
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
                    <RealtimeTransportModePanel
                        key={mode}
                        mode={mode}
                        realtimeLines={realtimeLines}
                    />
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
                    <PermanentLinesPanel realtimeLines={realtimeLines} />
                )}
            </div>
        </div>
    )
}

export { RealtimeDataPanel }
