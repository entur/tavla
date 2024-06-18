import { QuaysSearchQuery } from 'graphql/index'
import { isNotNullOrUndefined } from 'utils/typeguards'
import { hasDuplicateInArrayByKey } from 'utils/filters'
import { TDirectionType } from 'types/graphql-schema'
import { NormalizedDropdownItemType } from '@entur/dropdown'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { countBy } from 'lodash'
import { getTransportIcon } from 'components/TransportIcon'
import { useQuery } from 'hooks/useQuery'
import { TLineFragment } from '../edit/[id]/components/TileCard/types'

function getPlatformLabel(
    index: number,
    publicCode?: string | null,
    description?: string | null,
    directionTypes?: (TDirectionType | null | undefined)[] | null,
    lines?: TLineFragment[] | null,
) {
    const lineInformation = lines
        ?.map((line) => line.publicCode)
        .slice(0, 5)
        .sort()
        .join(', ')

    if (!publicCode && !description) {
        return `${index + 1} ${getDirection(
            directionTypes,
        )} (${lineInformation})`
    }
    return [publicCode, description, `(${lineInformation})`]
        .filter(isNotNullOrUndefined)
        .join(' ')
}

function getDirection(
    directionTypes?: (TDirectionType | null | undefined)[] | null,
) {
    const directionCount = countBy(directionTypes)
    const direction = Object.keys(directionCount).filter(
        (k) =>
            directionCount[k] ==
            Math.max.apply(null, Object.values(directionCount)),
    )[0]

    if (direction === 'inbound') return '- Retning sentrum'
    return ''
}

function useQuaySearch(stopPlaceId: string) {
    const { data } = useQuery(QuaysSearchQuery, { stopPlaceId: stopPlaceId })
    const [selectedQuay, setSelectedQuay] =
        useState<NormalizedDropdownItemType | null>(null)

    useEffect(() => setSelectedQuay(null), [stopPlaceId])

    const quays = useMemo(
        () =>
            data?.stopPlace?.quays
                ?.filter(isNotNullOrUndefined)
                .map((quay, index) => ({
                    value: quay.id,
                    label: getPlatformLabel(
                        index,
                        quay.publicCode,
                        quay.description,
                        quay.journeyPatterns.map((jp) => jp?.directionType),
                        quay.lines,
                    ),
                    icons: quay.stopPlace?.transportMode?.map((mode) =>
                        getTransportIcon(mode ?? 'unknown'),
                    ),
                }))
                .sort((a, b) => {
                    return a.label.localeCompare(b.label, 'no-NB', {
                        numeric: true,
                    })
                })
                .map((item, index, array) => {
                    if (!hasDuplicateInArrayByKey(array, item, 'label')) {
                        return item
                    } else {
                        return {
                            ...item,
                            label: item.label,
                            icons: item.icons,
                        }
                    }
                }) || [],
        [data],
    )

    const getQuays = useCallback(
        () => [{ value: stopPlaceId, label: 'Vis alle' }, ...quays],
        [quays, stopPlaceId],
    )

    return { quays: getQuays, selectedQuay, setSelectedQuay }
}

export { useQuaySearch }
