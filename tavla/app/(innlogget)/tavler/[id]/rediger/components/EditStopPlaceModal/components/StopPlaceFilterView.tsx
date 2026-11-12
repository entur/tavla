import { Paragraph } from '@entur/typography'
import TransportIcon from 'app/_components/TransportIcon/TransportIcon'
import type { EventProps } from 'app/posthog/events'
import { useMemo } from 'react'
import type { StopPlaceFilterDB } from 'types/db-types/boards'
import type { QuayWithFrontText } from '../../utils/types'
import {
    getGroupLineIds,
    groupLinesByTransportMode,
    transportModeNames,
    transportSubmodeNames,
} from '../utils'
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

    const patchSelectedLines = (newSelectedLines: string[]) => {
        setFilter({ ...filter, selectedLines: newSelectedLines })
        onFieldChanged('stop_place_filter')
    }

    const handleToggleLine = (
        _mode: string,
        lineId: string,
        checked: boolean,
    ) => {
        patchSelectedLines(
            checked
                ? [...filter.selectedLines, lineId]
                : filter.selectedLines.filter((id) => id !== lineId),
        )
    }

    const handleToggleGroup = (groupId: string, checked: boolean) => {
        const groupLineIds = getGroupLineIds(groupId, groupedByMode)
        patchSelectedLines(
            checked
                ? Array.from(
                      new Set([...filter.selectedLines, ...groupLineIds]),
                  )
                : filter.selectedLines.filter(
                      (id) => !groupLineIds.includes(id),
                  ),
        )
    }

    return (
        <div className="flex flex-col gap-2">
            <Paragraph margin="none">
                Velg hvilke transportmidler du vil vise
            </Paragraph>
            {groupedByMode.map(({ mode, lines, submodeGroups }) => (
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
                    childGroups={submodeGroups.map((submodeGroup) => ({
                        groupId: submodeGroup.groupId,
                        title:
                            transportSubmodeNames(submodeGroup.submode) ??
                            'Annet',
                        icons: (
                            <TransportIcon
                                transportMode={mode}
                                transportSubmode={
                                    submodeGroup.submode ?? undefined
                                }
                                background
                                whiteIcon
                                includeTooltip
                            />
                        ),
                        availableLines: submodeGroup.lines,
                    }))}
                    selectedLines={filter.selectedLines}
                    trackingLocation={trackingLocation}
                    trackingField="stop_place_filter"
                    onToggleLine={handleToggleLine}
                    onToggleGroup={handleToggleGroup}
                />
            ))}
        </div>
    )
}
