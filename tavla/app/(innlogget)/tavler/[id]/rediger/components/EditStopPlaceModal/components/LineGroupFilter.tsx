'use client'
import { BaseExpand, ExpandArrow } from '@entur/expand'
import { Checkbox } from '@entur/form'
import { ValidationInfoFilledIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import type { EventProps } from 'app/posthog/events'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import type { ReactNode } from 'react'
import { useState } from 'react'
import type { LineWithFrontText } from '../../utils/types'
import { sortLineFragment } from '../utils'
import { PublicCode } from './PublicCode'

type ChildGroup = {
    groupId: string
    title: string
    icons: ReactNode
    availableLines: LineWithFrontText[]
}

export function LineGroupFilter({
    groupId,
    title,
    description,
    tooltip,
    icons,
    availableLines,
    childGroups,
    trackingLocation,
    trackingField,
    selectedLines,
    onToggleLine,
    onToggleGroup,
}: {
    groupId: string
    title: string
    icons: ReactNode
    availableLines: LineWithFrontText[]
    /**
     * Når denne gruppa skal vises nøstet (f.eks. undermoduser under en
     * transportmiddel-gruppe), gis en liste med barnegrupper her. De vises
     * som indenterte underseksjoner - med egen velg alle-avkrysning, men
     * uten egen vis/skjul-linjer-kontroll - inni denne gruppas egen
     * vis/skjul-seksjon. Vi unngår med vilje en nøstet accordion (en
     * ekspanderbar seksjon inni en annen), det er ikke et etablert WAI-ARIA-
     * mønster og gir dårligere tastatur-/skjermleser-opplevelse.
     * `availableLines` skal da fortsatt være unionen av alle barnegruppenes
     * linjer, slik at "velg alle"-tilstanden for denne gruppa beregnes
     * riktig.
     */
    childGroups?: ChildGroup[]
    trackingLocation: EventProps<'stop_place_edit_interaction'>['location']
    trackingField: EventProps<'stop_place_edit_interaction'>['field']
    selectedLines: string[]
    onToggleLine: (groupId: string, lineId: string, checked: boolean) => void
    onToggleGroup: (groupId: string, checked: boolean) => void
    description?: string
    tooltip?: string
}) {
    const { capture } = usePosthogTracking()
    const linesId = `lines-${groupId}`

    const filterLineFragment = (line: LineWithFrontText) => {
        return !line.frontTexts || line.frontTexts.length > 0
    }

    const allLineIdsInGroup = availableLines
        .filter(filterLineFragment)
        .map((l) => l.id)
    const selectedIdsInGroup = allLineIdsInGroup.filter((id) =>
        selectedLines.includes(id),
    )

    const isAllSelected = selectedIdsInGroup.length === allLineIdsInGroup.length
    const isNoneSelected = selectedIdsInGroup.length === 0
    const isIndeterminate = !isAllSelected && !isNoneSelected

    const [isExpanded, setIsExpanded] = useState(isIndeterminate)

    const handleToggleGroupById = (targetGroupId: string, checked: boolean) => {
        capture('stop_place_edit_interaction', {
            location: trackingLocation,
            field: trackingField,
            column_value: 'none',
            action: checked ? 'select_all' : 'cleared',
        })
        onToggleGroup(targetGroupId, checked)
    }

    const handleToggleLineById = (
        targetGroupId: string,
        lineId: string,
        checked: boolean,
    ) => {
        capture('stop_place_edit_interaction', {
            location: trackingLocation,
            field: trackingField,
            column_value: 'none',
            action: 'changed',
        })
        onToggleLine(targetGroupId, lineId, checked)
    }

    const getSelectionState = (lines: LineWithFrontText[]) => {
        const lineIds = lines.filter(filterLineFragment).map((l) => l.id)
        const selectedIds = lineIds.filter((id) => selectedLines.includes(id))

        if (selectedIds.length === lineIds.length) return true
        if (selectedIds.length === 0) return false
        return 'indeterminate'
    }

    const renderLineCheckboxes = (
        lines: LineWithFrontText[],
        onLineToggle: (lineId: string, checked: boolean) => void,
    ) =>
        [...lines]
            .sort(sortLineFragment)
            .filter(filterLineFragment)
            .map((line) => (
                <Checkbox
                    key={line.id}
                    checked={selectedLines.includes(line.id)}
                    className="ml-1"
                    data-transport-mode={line.transportMode}
                    onChange={(e) => onLineToggle(line.id, e.target.checked)}
                >
                    <div className="flex flex-row items-center gap-2">
                        <PublicCode line={line} />
                        {line.frontTexts.join(' / ')}
                    </div>
                </Checkbox>
            ))

    return (
        <div className="rounded-lg border-2 p-4">
            <div className="flex flex-row justify-between">
                <div className="flex flex-row items-center justify-start gap-2">
                    <div className="flex flex-row gap-1 self-center">
                        {icons}
                    </div>
                    <div className="flex flex-row flex-wrap items-center gap-x-2">
                        {title}
                        {tooltip && (
                            <Tooltip
                                className="font-normal"
                                content={tooltip}
                                placement="top"
                                id={`tooltip-group-${groupId}`}
                            >
                                <ValidationInfoFilledIcon
                                    size={20}
                                    aria-labelledby={`tooltip-group-${groupId}`}
                                />
                            </Tooltip>
                        )}
                        {description && (
                            <span className="text-sm font-normal text-[#626493]">
                                {description}
                            </span>
                        )}
                    </div>
                </div>
                <Checkbox
                    id={`select-all-${groupId}`}
                    checked={isIndeterminate ? 'indeterminate' : isAllSelected}
                    onChange={(e) =>
                        handleToggleGroupById(groupId, e.target.checked)
                    }
                />
            </div>
            <button
                type="button"
                className="mt-2 flex flex-row items-center gap-1 text-sm text-[#626493]"
                aria-expanded={isExpanded}
                aria-controls={linesId}
                onClick={() => setIsExpanded((prev) => !prev)}
            >
                {isExpanded ? 'Skjul linjer' : 'Vis linjer'}
                <ExpandArrow open={isExpanded} />
            </button>
            <BaseExpand open={isExpanded} id={linesId}>
                {childGroups && childGroups.length > 0
                    ? childGroups.map((child) => {
                          const childSelectionState = getSelectionState(
                              child.availableLines,
                          )

                          return (
                              <div
                                  key={child.groupId}
                                  className="mt-3 flex flex-col gap-1 border-l-2 pl-3"
                              >
                                  <div className="flex flex-row items-center justify-between">
                                      <div className="flex flex-row items-center gap-2">
                                          {child.icons}
                                          <span className="text-sm font-medium">
                                              {child.title}
                                          </span>
                                      </div>
                                      <Checkbox
                                          id={`select-all-${child.groupId}`}
                                          checked={childSelectionState}
                                          onChange={(e) =>
                                              handleToggleGroupById(
                                                  child.groupId,
                                                  e.target.checked,
                                              )
                                          }
                                      />
                                  </div>
                                  {renderLineCheckboxes(
                                      child.availableLines,
                                      (lineId, checked) =>
                                          handleToggleLineById(
                                              child.groupId,
                                              lineId,
                                              checked,
                                          ),
                                  )}
                              </div>
                          )
                      })
                    : renderLineCheckboxes(availableLines, (lineId, checked) =>
                          handleToggleLineById(groupId, lineId, checked),
                      )}
            </BaseExpand>
        </div>
    )
}
