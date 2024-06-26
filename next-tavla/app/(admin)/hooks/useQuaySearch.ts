import { QuaysSearchQuery } from 'graphql/index'
import { isNotNullOrUndefined } from 'utils/typeguards'
import { hasDuplicateInArrayByKey } from 'utils/filters'
import { TDirectionType } from 'types/graphql-schema'
import { NormalizedDropdownItemType } from '@entur/dropdown'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { countBy } from 'lodash'
import { useQuery } from 'hooks/useQuery'
import { SmallTravelTag } from 'components/TravelTag'

function getPlatformLabel(
    index: number,
    publicCode?: string | null,
    description?: string | null,
    directionTypes?: (TDirectionType | null | undefined)[] | null,
) {
    if (!publicCode && !description) {
        return `${index + 1} ${getDirection(directionTypes)}`
    }
    return [publicCode, description].filter(isNotNullOrUndefined).join(' ')
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

function useQuaySearch(stopPlaceId: string, icons = true) {
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
                    ),
                    icons: quay.lines
                        ?.sort((l1, l2) => {
                            if (!l1.publicCode || !l2.publicCode) return 0
                            const l1Digits = l1.publicCode.match(/[^$,.\d]/)
                            const l2Digits = l2.publicCode.match(/[^$,.\d]/)

                            if (l1Digits && !l2Digits) return 1
                            if (!l1Digits && l2Digits) return -1
                            if (l1.publicCode < l2.publicCode) return -1
                            return 1
                        })
                        .slice(0, 5)
                        .map((line, index) => () => {
                            if (index === 4)
                                return SmallTravelTag({
                                    transportMode: 'unknown',
                                    publicCode: `+${quay.lines.length - index}`,
                                    icons: false,
                                })
                            return SmallTravelTag({
                                transportMode: line.transportMode,
                                publicCode: line.publicCode,
                                icons: icons,
                            })
                        }),
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
        [data, icons],
    )

    const getQuays = useCallback(
        () => [{ value: stopPlaceId, label: 'Vis alle' }, ...quays],
        [quays, stopPlaceId],
    )

    return { quays: getQuays, selectedQuay, setSelectedQuay }
}

export { useQuaySearch }
