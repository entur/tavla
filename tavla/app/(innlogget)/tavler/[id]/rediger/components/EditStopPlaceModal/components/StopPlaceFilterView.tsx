import { Paragraph } from '@entur/typography'
import TransportIcon from 'app/_components/TransportIcon/TransportIcon'
import type { EventProps } from 'app/posthog/events'
import { useMemo } from 'react'
import type { StopPlaceFilterDB } from 'types/db-types/boards'
import type { QuayWithFrontText } from '../../utils/types'
import { groupLinesByTransportMode, transportModeNames } from '../utils'
import { LineGroupFilter } from './LineGroupFilter'

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

    const handleToggleLine = (
        _mode: string,
        lineId: string,
        checked: boolean,
    ) => {
        patchWhitelistedLines(
            checked
                ? [...filter.whitelistedLines, lineId]
                : filter.whitelistedLines.filter((id) => id !== lineId),
        )
    }

    const handleToggleGroup = (mode: string, checked: boolean) => {
        const group = groupedByMode.find((g) => g.mode === mode)
        if (!group) return

        const groupLineIds = group.lines.map((line) => line.id)
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
                <LineGroupFilter
                    key={mode}
                    groupId={mode}
                    title={transportModeNames(mode) ?? mode}
                    icons={
                        <TransportIcon
                            transportMode={mode}
                            background
                            whiteIcon
                            includeTooltip
                        />
                    }
                    availableLines={lines}
                    whitelistedLines={filter.whitelistedLines}
                    trackingLocation={trackingLocation}
                    trackingField="stop_place_filter"
                    onToggleLine={handleToggleLine}
                    onToggleGroup={handleToggleGroup}
                />
            ))}
        </div>
    )
}
