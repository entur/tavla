import React, { useMemo } from 'react'
import { uniq } from 'lodash'
import { useSettings } from 'settings/SettingsProvider'
import { useRealtimePositionLineRefs } from 'hooks/use-realtime-position-line-refs/useRealtimePositionLineRefs'
import { useUniqueLines } from 'hooks/use-unique-lines/useUniqueLines'
import { Heading3, Label, Paragraph } from '@entur/typography'
import { Switch } from '@entur/form'
import { byTransportModeName } from './transportModeName'
import { PermanentLinesPanel } from './PermanentLinePanel/PermanentLinesPanel'
import { RealtimeTransportModePanel } from './RealtimeTransportModePanel/RealtimeTransportModePanel'
import classes from './RealtimeDetailPanel.module.scss'

function RealtimeDetailPanel() {
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
        <div className={classes.RealtimeDetailPanel}>
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
                <div className={classes.RouteDisplaySelection}>
                    <span className={classes.InfoText}>
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

export { RealtimeDetailPanel }
