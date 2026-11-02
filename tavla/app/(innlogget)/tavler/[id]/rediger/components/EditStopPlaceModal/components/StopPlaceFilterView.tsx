import { Paragraph } from '@entur/typography'
import type { EventProps } from 'app/posthog/events'
import { useMemo } from 'react'
import type { StopPlaceFilterDB } from 'types/db-types/boards'
import type { QuayWithFrontText } from '../../utils/types'
import { groupLinesByTransportMode } from '../utils'
import { TransportModeLines } from './TransportModeLines'

export function StopPlaceFilterView({
    quays,
    filter,
    setFilter,
    trackingLocation,
    onFieldChanged,
}: {
    quays: QuayWithFrontText[]
    filter: StopPlaceFilterDB
    setFilter: (filter: StopPlaceFilterDB) => void
    trackingLocation: EventProps<'stop_place_edit_interaction'>['location']
    onFieldChanged: (field: string) => void
}) {
    const groupedByMode = useMemo(
        () => groupLinesByTransportMode(quays),
        [quays],
    )

    const patchWhitelistedLines = (newWhitelistedLines: string[]) => {
        setFilter({ ...filter, whitelistedLines: newWhitelistedLines })
        onFieldChanged('stop_place_filter')
    }

    const handleToggleLine = (lineId: string, checked: boolean) => {
        patchWhitelistedLines(
            checked
                ? [...filter.whitelistedLines, lineId]
                : filter.whitelistedLines.filter((id) => id !== lineId),
        )
    }

    const handleToggleGroup = (groupLineIds: string[], checked: boolean) => {
        patchWhitelistedLines(
            checked
                ? Array.from(
                      new Set([...filter.whitelistedLines, ...groupLineIds]),
                  )
                : filter.whitelistedLines.filter(
                      (id) => !groupLineIds.includes(id),
                  ),
        )
    }

    return (
        <div className="flex flex-col gap-2">
            <Paragraph margin="none">
                Velg hvilke transportmidler du vil vise
            </Paragraph>
            {groupedByMode.map(({ mode, lines }) => (
                <TransportModeLines
                    key={mode}
                    mode={mode}
                    availableLines={lines}
                    whitelistedLines={filter.whitelistedLines}
                    trackingLocation={trackingLocation}
                    onToggleLine={handleToggleLine}
                    onToggleGroup={(checked) =>
                        handleToggleGroup(
                            lines.map((line) => line.id),
                            checked,
                        )
                    }
                />
            ))}
        </div>
    )
}
